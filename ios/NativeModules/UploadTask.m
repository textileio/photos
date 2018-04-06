//  Created by react-native-create-bridge

#import "UploadTask.h"
#import "AppDelegate.h"

// import RCTBridge
#if __has_include(<React/RCTBridge.h>)
#import <React/RCTBridge.h>
#elif __has_include(“RCTBridge.h”)
#import “RCTBridge.h”
#else
#import “React/RCTBridge.h” // Required when used as a Pod in a Swift project
#endif

// import RCTEventDispatcher
#if __has_include(<React/RCTEventDispatcher.h>)
#import <React/RCTEventDispatcher.h>
#elif __has_include(“RCTEventDispatcher.h”)
#import “RCTEventDispatcher.h”
#else
#import “React/RCTEventDispatcher.h” // Required when used as a Pod in a Swift project
#endif

@interface UploadTask() <NSURLSessionTaskDelegate, NSURLSessionDataDelegate>

@property (nonatomic, strong) NSURLSession *session;
@property (nonatomic, strong) NSMutableDictionary *responseData;

@end

@implementation UploadTask
@synthesize bridge = _bridge;

// Export a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html
RCT_EXPORT_MODULE();

- (instancetype)init
{
  self = [super init];
  if (self) {
    NSURLSessionConfiguration *conf = [NSURLSessionConfiguration backgroundSessionConfigurationWithIdentifier:@"textile-session"];
    conf.discretionary = NO; // TODO: Could be YES
    conf.sessionSendsLaunchEvents = YES;
    self.session = [NSURLSession sessionWithConfiguration:conf delegate:self delegateQueue:nil];
    self.responseData = [NSMutableDictionary new];
  }
  return self;
}

// Export methods to a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html

RCT_REMAP_METHOD(getUploadTasks, getUploadTasksWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  [self getUploadTasksWithCompletionHandler:^(NSArray<NSString *> *uploadTaskIds) {
    resolve(uploadTaskIds);
  }];
}

RCT_EXPORT_METHOD(uploadFile:(NSString *)file toURL:(NSString *)url withMethod:(NSString *)method formBoundary:(NSString *)boundary)
{
  NSURL *fileUrl = [NSURL fileURLWithPath:file];
  NSURL *endpointUrl = [NSURL URLWithString:url];
  [self uploadFile:fileUrl toUrl:endpointUrl withMethod:method formBoundary:boundary];
}

// List all your events here
// https://facebook.github.io/react-native/releases/next/docs/native-modules-ios.html#sending-events-to-javascript
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"UploadTaskProgress", @"UploadTaskComplete"];
}

#pragma mark - Private methods

// Implement methods that you want to export to the native module

- (void)getUploadTasksWithCompletionHandler:(void (^)(NSArray<NSString *> *uploadTaskIds))completionHandler {
  [self.session getAllTasksWithCompletionHandler:^(NSArray<__kindof NSURLSessionTask *> * _Nonnull tasks) {
    NSMutableArray<NSString *> *ids = @[].mutableCopy;
    [tasks enumerateObjectsUsingBlock:^(__kindof NSURLSessionTask * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
      [ids addObject:obj.taskDescription];
    }];
    completionHandler(ids);
  }];
}

- (void)uploadFile:(NSURL *)file toUrl:(NSURL *)url withMethod:(NSString *)method formBoundary:(NSString *)boundary {
  NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
  request.HTTPMethod = method;
  [request setValue:[NSString stringWithFormat:@"multipart/form-data; boundary=%@", boundary] forHTTPHeaderField:@"Content-Type"];
  NSURLSessionUploadTask *task = [self.session uploadTaskWithRequest:request fromFile:file];
  [task setTaskDescription:file.path];
  [task resume];
}

- (void) emitMessageToRN: (NSString *)eventName :(NSDictionary *)params {
  // The bridge eventDispatcher is used to send events from native to JS env
  // No documentation yet on DeviceEventEmitter: https://github.com/facebook/react-native/issues/2819
  [self sendEventWithName: eventName body: params];
}

# pragma mark - NSURLSessionTaskDelegate

- (void)URLSessionDidFinishEventsForBackgroundURLSession:(NSURLSession *)session {
  dispatch_async(dispatch_get_main_queue(), ^{
    AppDelegate *delegate = (AppDelegate *)UIApplication.sharedApplication.delegate;
    if (delegate.backgroundCompletionHandler) {
      delegate.backgroundCompletionHandler();
    }
  });
}

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didSendBodyData:(int64_t)bytesSent totalBytesSent:(int64_t)totalBytesSent totalBytesExpectedToSend:(int64_t)totalBytesExpectedToSend {
  float fraction = @(totalBytesSent).floatValue/@(totalBytesExpectedToSend).floatValue;
  NSDictionary *dict = @{ @"file": task.taskDescription, @"progress": @(fraction) };
  [self emitMessageToRN:@"UploadTaskProgress" :dict];
}

- (void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask didReceiveData:(NSData *)data {
  NSMutableData *responseData = self.responseData[@(dataTask.taskIdentifier)];
  if (!responseData) {
    responseData = [NSMutableData dataWithData:data];
    self.responseData[@(dataTask.taskIdentifier)] = responseData;
  } else {
    [responseData appendData:data];
  }
}

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didCompleteWithError:(NSError *)error {
  NSMutableDictionary *dict = [NSMutableDictionary dictionaryWithDictionary:@{@"file": task.taskDescription}];
  NSInteger responseCode = ((NSHTTPURLResponse*)task.response).statusCode;
  NSMutableData *responseData = self.responseData[@(task.taskIdentifier)];
  if (error) {
    [dict setValue:@{ @"domain": error.domain, @"code": @(error.code), @"message": error.localizedDescription } forKey:@"error"];
  } else if (responseCode < 200 || responseCode > 299) {
    [dict setValue:@{ @"domain": @"textile", @"code": @0, @"message": [NSString stringWithFormat:@"Bad server response code: %ld", (long)responseCode] } forKey:@"error"];
  } else if (!responseData) {
    [dict setValue:@{ @"domain": @"textile", @"code": @1, @"message": @"Missing server response data" } forKey:@"error"];
  } else {
    NSString *response = [[NSString alloc] initWithData:responseData encoding:NSUTF8StringEncoding];
    NSMutableArray<NSString *> *components = [response componentsSeparatedByString:@"\n"].mutableCopy;
    [components removeLastObject];
    NSMutableArray<NSDictionary *> *componentsJson = @[].mutableCopy;
    [components enumerateObjectsUsingBlock:^(NSString * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
      NSDictionary *json = [NSJSONSerialization JSONObjectWithData:[obj dataUsingEncoding:NSUTF8StringEncoding] options:0 error:nil];
      [componentsJson addObject:json];
    }];
    NSString __block *hash;
    [componentsJson enumerateObjectsUsingBlock:^(NSDictionary * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
      if ([[obj objectForKey:@"Name"] isEqualToString:@""]) {
        hash = [obj objectForKey:@"Hash"];
        *stop = YES;
        return;
      }
    }];
    if (hash) {
      [dict setValue:hash forKey:@"hash"];
    } else {
      [dict setValue:@{ @"domain": @"textile", @"code": @2, @"message": @"Unable to parse hash from server response" } forKey:@"error"];
    }
    [self.responseData removeObjectForKey:@(task.taskIdentifier)];
  }
  [self emitMessageToRN:@"UploadTaskComplete" :dict];
}

@end
