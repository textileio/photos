// https://stackoverflow.com/questions/38818287/react-native-bridge-is-nil-when-i-call-method-from-another-method#answer-43543711

#import "Events.h"

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

@implementation Events

RCT_EXPORT_MODULE();

// The list of available events
- (NSArray<NSString *> *)supportedEvents {
  return @[@"newLocalPhoto", @"onOnline", @"onThreadUpdate", @"onThreadAdded", @"onThreadRemoved", @"onDeviceAdded", @"onDeviceRemoved", @"onNotification"];
}

// This function listens for the events we want to send out and will then pass the
// payload over to the emitEventInternal function for sending to Javascript
- (void)startObserving
{
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(emitEventInternal:)
                                               name:@"event-emitted"
                                             object:nil];
}

// This will stop listening if we require it
- (void)stopObserving
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

// This will actually throw the event out to our Javascript
- (void)emitEventInternal:(NSNotification *)notification
{
  // We will receive the dictionary here - we now need to extract the name
  // and payload and throw the event
  NSArray *eventDetails = [notification.userInfo valueForKey:@"detail"];
  NSString *eventName = [eventDetails objectAtIndex:0];
  NSDictionary *eventData = [eventDetails objectAtIndex:1];

  [self sendEventWithName:eventName body:eventData];
}

// This is our static function that we call from our code
+ (void)emitEventWithName:(NSString *)name andPayload:(NSString *)payload
{
  // userInfo requires a dictionary so we wrap out name and payload into an array and stick
  // that into the dictionary with a key of 'detail'
  NSData *data = [payload dataUsingEncoding:NSUTF8StringEncoding];
  NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
  NSDictionary *eventDetail = @{@"detail":@[name,json]};
  [[NSNotificationCenter defaultCenter] postNotificationName:@"event-emitted"
                                                      object:self
                                                    userInfo:eventDetail];
}

@end

