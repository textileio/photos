#import "Peripheral.h"

@interface Peripheral()

@end

@implementation Peripheral

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(init:(NSString *)name address:(NSString *)address avatar:(NSString *)avatar) {
  [self initialize:name address:address avatar:avatar];
}

//RCT_EXPORT_METHOD(advertiseOn) {
//  [self advertiseToggle:true];
//}
//
//RCT_EXPORT_METHOD(advertiseOff) {
//  [self advertiseToggle:false];
//}

#pragma mark -
#pragma mark Public Methods
- (void)initialize:(NSString *)name address:(NSString *)address avatar:(NSString *)avatar {
  self.name = name;
  self.address = address;
  self.avatar = avatar;
  self.appUUID = @"0000b81d-0000-1000-8000-00805f8b34fb";
  self.manager = [[CBPeripheralManager alloc] init];
  self.manager.delegate = self;

//  CBCharacteristicProperties props = CBCharacteristicPropertyBroadcast;
//  CBAttributePermissions perms = CBAttributePermissionsReadable;
//  CBMutableCharacteristic *characteristic = [[CBMutableCharacteristic alloc] initWithType:self.appUUID properties:props value:NULL permissions:perms];
//  CBMutableService *service = [[CBMutableService alloc] initWithType:self.appUUID primary:TRUE];


//  self.finaldata = [[NSMutableData alloc]init];
//  self.manager = [[CBCentralManager alloc] init];
//  self.manager.delegate = self;
}

- (void) advertise:(NSDictionary *)data {
  [self.manager startAdvertising:data];
}

- (void) stop {
  [self.manager stopAdvertising];
}


- (void)peripheralManagerDidUpdateState:(nonnull CBPeripheralManager *)peripheral {
  NSLog(@"peripheral");
  if(peripheral.state == CBManagerStatePoweredOn) {
    NSLog(@"%@",peripheral.observationInfo);
    NSLog(peripheral.isAdvertising ? @"Yes" : @"No");
    NSLog(@"%@",peripheral.description);
    NSLog(@"peripheral on!");
  }
}

- (void)peripheralManagerDidStartAdvertising:(CBPeripheralManager *)peripheral error:(NSError *)error {
  NSLog(@"peripheral advertising");
  if(peripheral.state == CBManagerStatePoweredOn) {
    NSLog(@"%@",peripheral.observationInfo);
    NSLog(peripheral.isAdvertising ? @"Yes" : @"No");
    NSLog(@"%@",peripheral.description);
    NSLog(@"peripheral on!");
  }
}

@end
