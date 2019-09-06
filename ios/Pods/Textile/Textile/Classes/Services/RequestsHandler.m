#import "RequestsHandler.h"
#import "TextileApi.h"
#import "ProtoCallback.h"

@interface RequestsHandler () <NSURLSessionDelegate, NSURLSessionTaskDelegate, NSURLSessionDataDelegate>

@property (nonatomic, weak) Textile *textile;
@property (nonatomic, strong) NSURLSession *session;

@end

@implementation RequestsHandler

const int BATCH_SIZE = 16;
const NSString *WAIT_SRC = @"RequestsHandler.flush";

dispatch_queue_t flushQueue;

- (instancetype)initWithTextile:(Textile *)textile {
  if (self = [super init]) {
    self.textile = textile;

    // This serial queue is used to process calls to flush so we only process one at a time
    flushQueue = dispatch_queue_create("io.textile.flushQueue", DISPATCH_QUEUE_SERIAL);
  }
  return self;
}

- (void)start {
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

- (void)flush {
  // We don't know what thread we're being called on here, so dispatch to our
  // serial queue to make sure only one call to flush can be processed at a time
  [self.textile.node waitAdd:1 src:WAIT_SRC];
  dispatch_async(flushQueue, ^{
    [self processQueue];
    [self.textile.node waitDone:WAIT_SRC];
  });
}

- (void)processQueue {
  NSLog(@"Flushing cafe requests queue");
  UIBackgroundTaskIdentifier taskId = [UIApplication.sharedApplication beginBackgroundTaskWithName:@"processQueue" expirationHandler:nil];
  NSLog(@"Started background task %lu", (unsigned long)taskId);

  NSError *error;
  NSData *cafeRequestsData = [self.textile.node cafeRequests:BATCH_SIZE error:&error];
  if (error) {
    NSLog(@"cafeRequests query error: %@", error.localizedDescription);
    return;
  }

  Strings *requestIds = [[Strings alloc] initWithData:cafeRequestsData error:&error];
  if (!requestIds) {
    NSLog(@"Error deserializing Strings: %@", error.localizedDescription);
    return;
  }

  // Dispatch group used to wait until this CafeHTTPRequests batch in finished processing
  dispatch_group_t group = dispatch_group_create();

  for (NSString *requestId in requestIds.valuesArray) {

    ProtoCallback *cb = [[ProtoCallback alloc] initWithCompletion:^(NSData * _Nonnull data, NSError * _Nonnull error) {
      NSError *nodeStartError;
      BOOL started = [self.textile start:&nodeStartError];
      if (!started) {
        NSLog(@"failed to assure node started for request %@: %@", requestId, nodeStartError.localizedDescription);
        return;
      }
      if (!data) {
        NSLog(@"failed to write cafe request %@: %@", requestId, error.localizedDescription);
        NSError *failRequestError;
        BOOL success = [self.textile.node failCafeRequest:requestId reason:error.localizedDescription error:&failRequestError];
        if (!success) {
          NSLog(@"failed to fail cafe request %@: %@", requestId, failRequestError.localizedDescription);
        }
        dispatch_group_leave(group);
        return;
      }

      CafeHTTPRequest *httpRequest = [[CafeHTTPRequest alloc] initWithData:data error:&error];
      if (!httpRequest) {
        NSLog(@"error unmarshalling CafeHTTPRequest %@: %@", requestId, error.localizedDescription);
        NSError *failRequestError;
        BOOL success = [self.textile.node failCafeRequest:requestId reason:error.localizedDescription error:&failRequestError];
        if (!success) {
          NSLog(@"failed to fail cafe request %@: %@", requestId, failRequestError.localizedDescription);
        }
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

      NSError *markPendingError;
      BOOL success = [self.textile.node cafeRequestPending:requestId error:&markPendingError];
      if (!success) {
        NSLog(@"error marking request %@ as pending: %@", requestId, markPendingError.localizedDescription);
        NSError *failRequestError;
        BOOL success = [self.textile.node failCafeRequest:requestId reason:markPendingError.localizedDescription error:&failRequestError];
        if (!success) {
          NSLog(@"failed to fail cafe request %@: %@", requestId, failRequestError.localizedDescription);
        }
        dispatch_group_leave(group);
        return;
      }

      [task resume];

      dispatch_group_leave(group);
    }];

    dispatch_group_enter(group);

    [self.textile.node writeCafeRequest:requestId cb:cb];
  }

  // Block here until all writeCafeRequest callbacks are complete
  dispatch_group_wait(group, DISPATCH_TIME_FOREVER);

  NSLog(@"Ending background task %lu", (unsigned long)taskId);

  [UIApplication.sharedApplication endBackgroundTask:taskId];
}

#pragma mark NSURLSessionDelegate

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
  // Could so something cool here to let the client know
  NSLog(@"session task %@ taskIsWaitingForConnectivity", task.description);
}

/* Sent periodically to notify the delegate of upload progress.  This
 * information is also available as properties of the task.
 */
- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task
   didSendBodyData:(int64_t)bytesSent
    totalBytesSent:(int64_t)totalBytesSent
totalBytesExpectedToSend:(int64_t)totalBytesExpectedToSend {
  NSError *error;
  BOOL started = [self.textile start:&error];
  if (!started) {
    NSLog(@"failed to assure node started for request %@: %@", task.description, error.localizedDescription);
    return;
  }
  NSLog(@"session task %@ didSendBodyData: %lld - %lld of %lld", task.description, bytesSent, totalBytesSent, totalBytesExpectedToSend);
  BOOL success = [self.textile.node updateCafeRequestProgress:task.taskDescription transferred:totalBytesSent total:totalBytesExpectedToSend error:&error];
  if (!success) {
    NSLog(@"failed to updateCafeRequestProgress for request %@: %@", task.description, error.localizedDescription);
    return;
  }
}

/* Sent as the last message related to a specific task.  Error may be
 * nil, which implies that no error occurred and this task is complete.
 */
- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task
didCompleteWithError:(nullable NSError *)error {
  NSLog(@"session task %@ didCompleteWithError: %@, %@, %@", task.description, task.originalRequest, task.response, error.localizedDescription);
  NSError *nodeStartError;
  BOOL started = [self.textile start:&nodeStartError];
  if (!started) {
    NSLog(@"failed to assure node started for request %@: %@", task.description, nodeStartError.localizedDescription);
    return;
  }
  NSHTTPURLResponse *response = (NSHTTPURLResponse *)task.response;
  if (error) {
    NSError *failRequestError;
    BOOL success = [self.textile.node failCafeRequest:task.taskDescription reason:error.localizedDescription error:&failRequestError];
    if (!success) {
      NSLog(@"failed to failCafeRequest for request %@: %@", task.description, failRequestError.localizedDescription);
    }
  } else if (response.statusCode < 200 || response.statusCode > 299) {
    NSString *error = [NSString stringWithFormat:@"status code: %ld", (long)response.statusCode];
    NSError *failRequestError;
    BOOL success = [self.textile.node failCafeRequest:task.taskDescription reason:error error:&failRequestError];
    if (!success) {
      NSLog(@"failed to failCafeRequest for request %@: %@", task.description, failRequestError.localizedDescription);
    }
  } else {
    NSError *completeRequestError;
    BOOL success = [self.textile.node completeCafeRequest:task.taskDescription error:&completeRequestError];
    if (!success) {
      NSLog(@"failed to completeCafeRequest for request %@: %@", task.description, completeRequestError.localizedDescription);
    }
  }

  // We can call flush again if there are no more pending tasks
  [self.session getAllTasksWithCompletionHandler:^(NSArray<__kindof NSURLSessionTask *> * _Nonnull tasks) {
    if ([tasks count] == 0) {
      [self flush];
    }
  }];
}

@end
