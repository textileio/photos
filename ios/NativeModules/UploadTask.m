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

@interface UploadTask() <NSURLSessionTaskDelegate>

@property (nonatomic, strong) NSURLSession *session;

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

RCT_EXPORT_METHOD(uploadFile:(NSString *)file toURL:(NSString *)url withMethod:(NSString *)method)
{
  NSURL *fileUrl = [NSURL fileURLWithPath:file];
  NSURL *endpointUrl = [NSURL URLWithString:url];
  [self uploadFile:fileUrl toUrl:endpointUrl withMethod:method];
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

- (void)uploadFile:(NSURL *)file toUrl:(NSURL *)url withMethod:(NSString *)method {
  NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
  request.HTTPMethod = method;
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

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didCompleteWithError:(NSError *)error {
  NSMutableDictionary *dict = [NSMutableDictionary dictionaryWithDictionary:@{@"file": task.taskDescription}];
  NSInteger responseCode = ((NSHTTPURLResponse*)task.response).statusCode;
  if (error) {
    [dict setValue:@{ @"domain": error.domain, @"code": @(error.code), @"message": error.localizedDescription } forKey:@"error"];
  } else if (responseCode < 200 || responseCode > 299) {
    [dict setValue:@{ @"domain": @"textile", @"code": @0, @"message": [NSString stringWithFormat:@"Bad server response code: %ld", (long)responseCode] } forKey:@"error"];
  }
  [self emitMessageToRN:@"UploadTaskComplete" :dict];
}

@end
