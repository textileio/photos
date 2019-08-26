#import "Nearby.h"

@interface Nearby()

@end

@implementation Nearby

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(init:(NSString *)name address:(NSString *)address avatar:(NSString *)avatar) {
  [self initialize:name address:address avatar:avatar];
}

RCT_EXPORT_METHOD(scan) {
  [self initScan];
}

RCT_EXPORT_METHOD(advertise) {
  [self startAdvertising];
}
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
  self.appUUID = [CBUUID UUIDWithString:@"0000b81d-0000-1000-8000-00805f8b34fb"];

  self.finaldata = [[NSMutableData alloc]init];
  self.manager = [[CBCentralManager alloc] init];
  self.manager.delegate = self;
  self.peripheral = [[Peripheral alloc] init];
//  self.peripheral.initialize(name, address, avatar);
  [self.peripheral initialize:name address:address avatar:avatar];
}

- (void)startAdvertising {
//  self.periphera.initialize
  //l = [[Peripheral alloc] initialize:name address:address avatar:avatar];
  NSDictionary *discoveryInfo = @{ @"address": self.address, @"avatar": self.avatar, @"name": self.name };
  [self.peripheral advertise:discoveryInfo];
}

- (void) initScan {
  [self.manager stopScan];
  //  Look for services only with our shared app uuid
  NSArray *services = [NSArray arrayWithObjects:self.appUUID, nil];
  NSDictionary *discoveryInfo = @{ @"address": self.address, @"avatar": self.avatar, @"name": self.name };
  [self.manager
   scanForPeripheralsWithServices:nil
   options:nil
//   options:[NSDictionary dictionaryWithObjectsAndKeys:discoveryInfo, CBCentralManagerScanOptionAllowDuplicatesKey, nil]
  ];
}

- (void) peripheral:(CBPeripheral *)aPeripheral didDiscoverServices:(nullable NSError *)error {

  NSLog(@"Yoo");
}

- (void) peripheral:(CBPeripheral *)aPeripheral didDiscoverCharacteristicsForService:(CBService *)service error:(NSError *)error
{

  NSLog(@"HEYOOOO");
  NSLog(@"%@",aPeripheral.identifier);
  NSLog(@"%@",aPeripheral.observationInfo);
  NSLog(@"%@",aPeripheral.description);
  NSLog(@"more?");
  for (CBCharacteristic *aChar in service.characteristics){
    NSLog(@"%@",aChar.UUID);
//    [TextView insertText:[NSString stringWithFormat:@"Characteristic UUID:%@\n",aChar.UUID]];
    if ([aChar.UUID isEqual:[CBUUID UUIDWithString:@"DA18"]]) {
      NSLog(@"%lu",aChar.properties);
//      [TextView insertText:[NSString stringWithFormat:@"Characteristic Prop:%lu\n",aChar.properties]];
      [aPeripheral setNotifyValue:YES forCharacteristic:aChar];
    }
    if ([aChar.UUID isEqual:[CBUUID UUIDWithString:@"DA17"]]) {
      //NSLog(@"Find DA17");
      NSLog(@"%lu",aChar.properties);
//      [TextView insertText:[NSString stringWithFormat:@"Characteristic Prop:%lu\n",aChar.properties]];
      NSString *mainString = [NSString stringWithFormat:@"12345"];
      NSData *mainData= [mainString dataUsingEncoding:NSUTF8StringEncoding];
      [aPeripheral writeValue:mainData forCharacteristic:aChar type:CBCharacteristicWriteWithResponse];
    }
    if ([aChar.UUID isEqual:[CBUUID UUIDWithString:@"DA16"]]) {
      NSLog(@"Find DA16");
      NSLog(@"%lu",aChar.properties);
//      [TextView insertText:[NSString stringWithFormat:@"Characteristic Prop:%lu\n",aChar.properties]];
      //[aPeripheral readValueForCharacteristic:aChar];
    }
  }
}

- (void)peripheral:(CBPeripheral *)peripheral didWriteValueForCharacteristic:(CBCharacteristic *)characteristic error:(NSError *)error{
  NSLog(@"Finish Write\n");
//  [TextView insertText:@"Finish Write\n"];
}

- (void) peripheral:(CBPeripheral *)aPeripheral didUpdateValueForCharacteristic:(CBCharacteristic *)characteristic error:(NSError *)error
{
  NSData * updatedValue = characteristic.value;
  NSLog(@"%@",[[NSString alloc]initWithData:updatedValue encoding:NSUTF8StringEncoding]);
  if ([[[NSString alloc]initWithData:updatedValue encoding:NSUTF8StringEncoding]isEqualToString:@"ENDAL"]) {
    [self.manager cancelPeripheralConnection:aPeripheral];
//    [TextView insertText:[NSString stringWithFormat:@"%@\n",[[NSJSONSerialization JSONObjectWithData:finaldata options:kNilOptions error:nil]description]]];
  }else{
    [self.finaldata appendData:updatedValue];
  }
}

- (IBAction)Connect:(id)sender {
  //A workaround for CBPeripheralManager
  [self.manager scanForPeripheralsWithServices:@[ self.appUUID ] options:@{ CBCentralManagerScanOptionAllowDuplicatesKey : [NSNumber numberWithBool:YES] }];
//  Button.title = @"Scanning";
//  [Button setEnabled:NO];
}

- (IBAction)disconnect:(id)sender {
//  [self.manager cancelPeripheralConnection:self.peripheral];
}

- (void)centralManagerDidUpdateState:(nonnull CBCentralManager *)central {
  NSLog(@"We're something");
  if (central.state == CBManagerStatePoweredOn) {
    NSLog(@"We're COOKING");

//    CBCharacteristicProperties props = CBCharacteristicPropertyBroadcast;
//    CBAttributePermissions perms = CBAttributePermissionsReadable;
//    CBMutableCharacteristic *characteristic = [[CBMutableCharacteristic alloc] initWithType:self.appUUID properties:props value:NULL permissions:perms];
//    CBMutableService *service = [[CBMutableService alloc] initWithType:self.appUUID primary:TRUE];

  }
  NSLog(@"%ld",[self.manager state]);
}

- (void)centralManager:(CBCentralManager *)central didDiscoverPeripheral:(CBPeripheral *)peripheral advertisementData:(NSDictionary<NSString *,id> *)advertisementData RSSI:(NSNumber *)RSSI {
  NSLog(@"AXH");

  NSLog( @"%@", advertisementData);
  NSLog( @"%@", peripheral.services);
  NSLog( @"%@", peripheral.description);
  NSString *name = peripheral.name ? peripheral.name : @"no name";
  if ([name isEqualToString:@"Pixel 3"]) {
    NSLog( @"AXH %@", @"Jackpot" );
    [self.manager connectPeripheral:peripheral options:nil];
    NSLog( @"AXH %@", @"Jackpot" );
    [peripheral discoverServices:nil];
  }
  NSLog(@"AXH %@", name);
}

@end
