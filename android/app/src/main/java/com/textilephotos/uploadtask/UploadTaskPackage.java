//  Created by react-native-create-bridge

package com.textilephotos.uploadtask;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class UploadTaskPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
      // Register your native module
      // https://facebook.github.io/react-native/docs/native-modules-android.html#register-the-module
      return Arrays.<NativeModule>asList(
          new UploadTaskModule(reactContext)
      );
    }

    
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
