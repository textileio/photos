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
  return @[@"UploadTaskComplete"];
}

#pragma mark - Private methods

// Implement methods that you want to export to the native module

- (void)uploadFile:(NSURL *)file toUrl:(NSURL *)url withMethod:(NSString *)method {
  NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
  request.HTTPMethod = method;
  NSURLSessionUploadTask *task = [self.session uploadTaskWithRequest:request fromFile:file];
  [task setTaskDescription:file.absoluteString];
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

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didCompleteWithError:(NSError *)error {
  NSMutableDictionary *dict = [NSMutableDictionary dictionaryWithDictionary:@{@"file" : task.description}];
  if (error) {
    [dict setValue:@{ @"code":  @(error.code), @"description": error.localizedDescription } forKey:@"error"];
  }
  [self emitMessageToRN:@"UploadTaskComplete" :dict];
}

@end
