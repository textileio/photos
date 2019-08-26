#import <Foundation/Foundation.h>
//#import <React/RCTBridgeModule.h>
#import <CoreBluetooth/CoreBluetooth.h>

#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#elif __has_include("RCTBridgeModule.h")
#import “RCTBridgeModule.h”
#else
#import "React/RCTBridgeModule.h"
#endif
#import <React/RCTBridge.h>

@interface Peripheral : NSObject <CBPeripheralManagerDelegate, RCTBridgeModule>

@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) NSString *address;
@property (nonatomic, strong) NSString *avatar;
@property (nonatomic, strong) NSString *appUUID;
@property (nonatomic, strong) CBPeripheralManager *manager;


// CBCentral properties
//@property (nonatomic, strong) NSMutableData *finaldata;
//@property (nonatomic, strong) CBPeripheral *peripheral;
//@property (nonatomic, strong) CBCentralManager *manager;
//@property (nonatomic, strong) CBMutableCharacteristic *characteristic;

- (void)initialize:(NSString *)name address:(NSString *)address avatar:(NSString *)avatar;
- (void)advertise:(NSDictionary *)data;

@end

@interface RCTBridge (Peripheral)

@property (nonatomic, readonly) Peripheral *peripheral;

@end
