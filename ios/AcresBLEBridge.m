#import <React/RCTBridgeModule.h>
#import "AcresBLE-Swift.h"

@interface RCT_EXTERN_MODULE(AcresBLE, NSObject)
RCT_EXTERN_METHOD(findDevice:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
@end

@implementation AcresBLE

RCT_EXPORT_MODULE();

@end
