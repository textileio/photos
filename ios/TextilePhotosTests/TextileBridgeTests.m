#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>
#import <RCTTest/RCTTestRunner.h>
#import <React/RCTAssert.h>

#ifndef FB_REFERENCE_IMAGE_DIR
#define FB_REFERENCE_IMAGE_DIR "\"$(SOURCE_ROOT)/$(PROJECT_NAME)Tests/ReferenceImages\""
#endif

#define RCT_TEST(name) \
- (void)test##name { \
  [_runner runTest:_cmd module:@#name]; \
}

@interface TextileBridgeTests : XCTestCase {
  RCTTestRunner *_runner;
}

@end

@implementation TextileBridgeTests

- (void)setUp {
  _runner = RCTInitRunnerForApp(@"Tests/IntegrationTests", nil, nil);
  _runner.recordMode = NO;
}

#pragma mark - Test harness

- (void)testTheTester_waitOneFrame {
  [_runner runTest:_cmd
            module:@"Tests"
      initialProps:@{@"waitOneFrame": @YES}
configurationBlock:nil];
}

#pragma mark - JS tests
// This list should be kept in sync with IntegrationTestsApp.js
RCT_TEST(IntegrationTests)
RCT_TEST(Tests)

@end
