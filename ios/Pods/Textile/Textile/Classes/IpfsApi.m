//
//  IpfsApi.m
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "IpfsApi.h"

@implementation IpfsApi

- (NSString *)peerId:(NSError * _Nullable __autoreleasing *)error {
  return [self.node peerId:error];
}

- (NSData *)dataAtPath:(NSString *)path error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node dataAtPath:path error:error];
}

@end
