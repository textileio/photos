//
//  RequestsHandler.m
//  Textile
//
//  Created by Aaron Sutula on 5/3/19.
//

#import "RequestsHandler.h"
#import "TextileApi.h"
#import "ProtoCallback.h"

@interface RequestsHandler () <NSURLSessionDelegate, NSURLSessionTaskDelegate, NSURLSessionDataDelegate>

@property (nonatomic, strong) NSURLSession *session;

@end

@implementation RequestsHandler

dispatch_queue_t flushQueue;

- (instancetype)init {
  if (self = [super init]) {
    // This serial queue is used to process calls to flush so we only process one at a time
    flushQueue = dispatch_queue_create("io.textile.flushQueue", DISPATCH_QUEUE_SERIAL);

    // Configure and create our NSURLSession used for uplaods
    NSURLSessionConfiguration *config = [NSURLSessionConfiguration backgroundSessionConfigurationWithIdentifier:TEXTILE_BACKGROUND_SESSION_ID];
    config.networkServiceType = NSURLNetworkServiceTypeResponsiveData;
    config.allowsCellularAccess = YES; // default
    config.timeoutIntervalForRequest = 60; //default
    config.timeoutIntervalForResource = 60 * 60 * 24; // 1 day
    // config.waitsForConnectivity = YES; // defaults to YES for background sessions, not availiable until iOS 11 anyway
    config.sessionSendsLaunchEvents = YES; // default
    config.discretionary = NO; // default
    config.shouldUseExtendedBackgroundIdleMode = YES; // not really sure about this
    config.HTTPMaximumConnectionsPerHost = 10; // default 4 for ios
    self.session = [NSURLSession sessionWithConfiguration:config delegate:self delegateQueue:nil];
  }
  return self;
}

- (void)flush {
  // We don't know what thread we're being called on here, so dispatch to our
  // serial queue to make sure only one call to flush can be processed at a time
  dispatch_async(flushQueue, ^{
    [self processQueue];
  });
}

- (void)processQueue {
  NSLog(@"Flushing");

  UIBackgroundTaskIdentifier taskId = [UIApplication.sharedApplication beginBackgroundTaskWithExpirationHandler:nil];

  NSError *error;
  NSData *cafeRequestsData = [self.node cafeRequests:-1 error:&error];
  if (error) {
    NSLog(@"cafeRequests error: %@", error.localizedDescription);
    return;
  }

  Strings *requestIds = [[Strings alloc] initWithData:cafeRequestsData error:&error];
  if (!requestIds) {
    NSLog(@"Error deserializing Strings: %@", error.localizedDescription);
    return;
  }

  // Dispatch group used to wait until processing all CafeHTTPRequests in this call to process are complete
  dispatch_group_t group = dispatch_group_create();

  for (NSString *requestId in requestIds.valuesArray) {

    // TODO: Is there any reason to call failCafeRequest before it is marked as pending?
    // TODO: Should we mark as pending before writing to disk or after?

    ProtoCallback *cb = [[ProtoCallback alloc] initWithCompletion:^(NSData * _Nonnull data, NSError * _Nonnull error) {
      if (!data) {
        NSLog(@"error writing request: %@", error.localizedDescription);
        NSLog(@"Leaving");
        dispatch_group_leave(group);
        return;
      }

      CafeHTTPRequest *httpRequest = [[CafeHTTPRequest alloc] initWithData:data error:&error];
      if (!httpRequest) {
        NSLog(@"error unmarshalling CafeHTTPRequest: %@", error.localizedDescription);
        NSLog(@"Leaving");
        dispatch_group_leave(group);
        return;
      }

      NSURL *url = [NSURL URLWithString:httpRequest.URL];

      NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
      request.URL = url;
      request.allHTTPHeaderFields = httpRequest.headers;

      switch (httpRequest.type) {
        case CafeHTTPRequest_Type_Put:
          request.HTTPMethod = @"PUT";
          break;
        case CafeHTTPRequest_Type_Post:
          request.HTTPMethod = @"POST";
          break;
        case CafeHTTPRequest_Type_Delete:
          request.HTTPMethod = @"DELETE";
          break;
        default:
          break;
      }

      NSURL *fileUrl = [NSURL fileURLWithPath:httpRequest.path];
      NSURLSessionUploadTask *task = [self.session uploadTaskWithRequest:request fromFile:fileUrl];
      [task setTaskDescription:requestId];

      BOOL result = [self.node cafeRequestPending:requestId error:&error];
      if (!result) {
        NSLog(@"error marking as pending: %@", error.localizedDescription);
        NSLog(@"Leaving");
        dispatch_group_leave(group);
        return;
      }

      [task resume];

      NSLog(@"Leaving");
      dispatch_group_leave(group);
    }];

    NSLog(@"Entering");
    dispatch_group_enter(group);

    [self.node writeCafeRequest:requestId cb:cb];
  }

  // Block here until all writeCafeRequest callbacks are complete
  dispatch_group_wait(group, DISPATCH_TIME_FOREVER);

  NSLog(@"Dispatch group complete");

  [UIApplication.sharedApplication endBackgroundTask:taskId];
}

#pragma mark NSURLSessionDelegate

/* The last message a session receives.  A session will only become
 * invalid because of a systemic error or when it has been
 * explicitly invalidated, in which case the error parameter will be nil.
 */
- (void)URLSession:(NSURLSession *)session didBecomeInvalidWithError:(nullable NSError *)error {
  NSLog(@"session didBecomeInvalidWithError: %@", error.localizedDescription);
}

/* If implemented, when a connection level authentication challenge
 * has occurred, this delegate will be given the opportunity to
 * provide authentication credentials to the underlying
 * connection. Some types of authentication will apply to more than
 * one request on a given connection to a server (SSL Server Trust
 * challenges).  If this delegate message is not implemented, the
 * behavior will be to use the default handling, which may involve user
 * interaction.
 */
//- (void)URLSession:(NSURLSession *)session didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge
// completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition disposition, NSURLCredential * _Nullable credential))completionHandler {
//  NSLog(@"session didReceiveChallenge");
//  completionHandler(NSURLSessionAuthChallengeUseCredential, nil);
//}

/* If an application has received an
 * -application:handleEventsForBackgroundURLSession:completionHandler:
 * message, the session delegate will receive this message to indicate
 * that all messages previously enqueued for this session have been
 * delivered.  At this time it is safe to invoke the previously stored
 * completion handler, or to begin any internal updates that will
 * result in invoking the completion handler.
 */
- (void)URLSessionDidFinishEventsForBackgroundURLSession:(NSURLSession *)session {
  NSLog(@"URLSessionDidFinishEventsForBackgroundURLSession");
  dispatch_async(dispatch_get_main_queue(), ^{
    if (Textile.instance.backgroundCompletionHandler) {
      Textile.instance.backgroundCompletionHandler();
      Textile.instance.backgroundCompletionHandler = nil;
    }
  });
}

#pragma mark NSURLSessionTaskDelegate

/*
 * Sent when the system is ready to begin work for a task with a delayed start
 * time set (using the earliestBeginDate property). The completionHandler must
 * be invoked in order for loading to proceed. The disposition provided to the
 * completion handler continues the load with the original request provided to
 * the task, replaces the request with the specified task, or cancels the task.
 * If this delegate is not implemented, loading will proceed with the original
 * request.
 *
 * Recommendation: only implement this delegate if tasks that have the
 * earliestBeginDate property set may become stale and require alteration prior
 * to starting the network load.
 *
 * If a new request is specified, the allowsCellularAccess property from the
 * new request will not be used; the allowsCellularAccess property from the
 * original request will continue to be used.
 *
 * Canceling the task is equivalent to calling the task's cancel method; the
 * URLSession:task:didCompleteWithError: task delegate will be called with error
 * NSURLErrorCancelled.
 */
//- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task
//willBeginDelayedRequest:(NSURLRequest *)request
// completionHandler:(void (^)(NSURLSessionDelayedRequestDisposition disposition, NSURLRequest * _Nullable newRequest))completionHandler  API_AVAILABLE(ios(11.0)) {
//  NSLog(@"session task willBeginDelayedRequest");
//  completionHandler(NSURLSessionDelayedRequestContinueLoading, nil);
//}

/*
 * Sent when a task cannot start the network loading process because the current
 * network connectivity is not available or sufficient for the task's request.
 *
 * This delegate will be called at most one time per task, and is only called if
 * the waitsForConnectivity property in the NSURLSessionConfiguration has been
 * set to YES.
 *
 * This delegate callback will never be called for background sessions, because
 * the waitForConnectivity property is ignored by those sessions.
 */
- (void)URLSession:(NSURLSession *)session taskIsWaitingForConnectivity:(NSURLSessionTask *)task {
  NSLog(@"session taskIsWaitingForConnectivity");
}

/* An HTTP request is attempting to perform a redirection to a different
 * URL. You must invoke the completion routine to allow the
 * redirection, allow the redirection with a modified request, or
 * pass nil to the completionHandler to cause the body of the redirection
 * response to be delivered as the payload of this request. The default
 * is to follow redirections.
 *
 * For tasks in background sessions, redirections will always be followed and this method will not be called.
 */
//- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task
//willPerformHTTPRedirection:(NSHTTPURLResponse *)response
//        newRequest:(NSURLRequest *)request
// completionHandler:(void (^)(NSURLRequest * _Nullable))completionHandler {
//  NSLog(@"session task willPerformHTTPRedirection");
//}

/* The task has received a request specific authentication challenge.
 * If this delegate is not implemented, the session specific authentication challenge
 * will *NOT* be called and the behavior will be the same as using the default handling
 * disposition.
 */
//- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task
//didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge
// completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition disposition, NSURLCredential * _Nullable credential))completionHandler {
//  NSLog(@"session task didReceiveChallenge");
//}

/* Sent if a task requires a new, unopened body stream.  This may be
 * necessary when authentication has failed for any request that
 * involves a body stream.
 */
//- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task
// needNewBodyStream:(void (^)(NSInputStream * _Nullable bodyStream))completionHandler {
//  NSLog(@"session task needNewBodyStream");
//}

/* Sent periodically to notify the delegate of upload progress.  This
 * information is also available as properties of the task.
 */
- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task
   didSendBodyData:(int64_t)bytesSent
    totalBytesSent:(int64_t)totalBytesSent
totalBytesExpectedToSend:(int64_t)totalBytesExpectedToSend {
//  NSLog(@"session task didSendBodyData: %lld - %lld of %lld", bytesSent, totalBytesSent, totalBytesExpectedToSend);
  [self.node updateCafeRequestProgress:task.taskDescription transerred:totalBytesSent total:totalBytesExpectedToSend error:nil];
}

/*
 * Sent when complete statistics information has been collected for the task.
 */
//- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didFinishCollectingMetrics:(NSURLSessionTaskMetrics *)metrics {
//  NSLog(@"session task didFinishCollectingMetrics: %@", metrics);
//}

/* Sent as the last message related to a specific task.  Error may be
 * nil, which implies that no error occurred and this task is complete.
 */
- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task
didCompleteWithError:(nullable NSError *)error {
//  NSLog(@"session task didCompleteWithError: %@, %@, %@", task.originalRequest, task.response, error.localizedDescription);
  NSHTTPURLResponse *response = (NSHTTPURLResponse *)task.response;
  if (error) {
    [self.node failCafeRequest:task.taskDescription reason:error.localizedDescription error:nil];
  } else if (response.statusCode < 200 || response.statusCode > 299) {
    NSString *error = [NSString stringWithFormat:@"status code: %ld", (long)response.statusCode];
    [self.node failCafeRequest:task.taskDescription reason:error error:nil];
  } else {
    [self.node completeCafeRequest:task.taskDescription error:nil];
  }
}

#pragma mark NSURLSessionDataDelegate

/* The task has received a response and no further messages will be
 * received until the completion block is called. The disposition
 * allows you to cancel a request or to turn a data task into a
 * download task. This delegate message is optional - if you do not
 * implement it, you can get the response as a property of the task.
 *
 * This method will not be called for background upload tasks (which cannot be converted to download tasks).
 */
//- (void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask
//didReceiveResponse:(NSURLResponse *)response
// completionHandler:(void (^)(NSURLSessionResponseDisposition disposition))completionHandler {
//  NSLog(@"session data task didReceiveResponse");
//}

/* Notification that a data task has become a download task.  No
 * future messages will be sent to the data task.
 */
- (void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask
didBecomeDownloadTask:(NSURLSessionDownloadTask *)downloadTask {
  NSLog(@"session data task didBecomeDownloadTask");
}

/*
 * Notification that a data task has become a bidirectional stream
 * task.  No future messages will be sent to the data task.  The newly
 * created streamTask will carry the original request and response as
 * properties.
 *
 * For requests that were pipelined, the stream object will only allow
 * reading, and the object will immediately issue a
 * -URLSession:writeClosedForStream:.  Pipelining can be disabled for
 * all requests in a session, or by the NSURLRequest
 * HTTPShouldUsePipelining property.
 *
 * The underlying connection is no longer considered part of the HTTP
 * connection cache and won't count against the total number of
 * connections per host.
 */
- (void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask
didBecomeStreamTask:(NSURLSessionStreamTask *)streamTask {
  NSLog(@"session data task didBecomeStreamTask");
}

/* Sent when data is available for the delegate to consume.  It is
 * assumed that the delegate will retain and not copy the data.  As
 * the data may be discontiguous, you should use
 * [NSData enumerateByteRangesUsingBlock:] to access it.
 */
- (void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask
    didReceiveData:(NSData *)data {
//  NSLog(@"session data task didReceiveData");
}

/* Invoke the completion routine with a valid NSCachedURLResponse to
 * allow the resulting data to be cached, or pass nil to prevent
 * caching. Note that there is no guarantee that caching will be
 * attempted for a given resource, and you should not rely on this
 * message to receive the resource data.
 */
//- (void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask
// willCacheResponse:(NSCachedURLResponse *)proposedResponse
// completionHandler:(void (^)(NSCachedURLResponse * _Nullable cachedResponse))completionHandler {
//  NSLog(@"session data task willCacheResponse");
//}

@end
