#import <Foundation/Foundation.h>
//#import <React/RCTBridgeModule.h>
#import <CoreBluetooth/CoreBluetooth.h>

#import "Peripheral.h"

#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#elif __has_include("RCTBridgeModule.h")
#import “RCTBridgeModule.h”
#else
#import "React/RCTBridgeModule.h"
#endif
#import <React/RCTBridge.h>

@interface Nearby : NSObject <CBCentralManagerDelegate, RCTBridgeModule>

@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) NSString *address;
@property (nonatomic, strong) NSString *avatar;
@property (nonatomic, strong) CBUUID *appUUID;
// CBCentral properties
@property (nonatomic, strong) NSMutableData *finaldata;
@property (nonatomic, strong) Peripheral *peripheral;
@property (nonatomic, strong) CBCentralManager *manager;
//@property (nonatomic, strong) CBMutableCharacteristic *characteristic;

- (void)initialize:(NSString *)name address:(NSString *)address avatar:(NSString *)avatar;
- (void)initScan;

@end

@interface RCTBridge (Nearby)

@property (nonatomic, readonly) Nearby *nearby;

@end
