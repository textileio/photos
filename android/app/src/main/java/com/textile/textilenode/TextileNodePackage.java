//  Created by react-native-create-bridge

package com.textile.textilenode;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class TextileNodePackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        // Register your native module
        // https://facebook.github.io/react-native/docs/native-modules-android.html#register-the-module
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new TextileNode(reactContext));
        modules.add(new CameraRoll(reactContext));
        modules.add(new FS(reactContext));

        return modules;
    }

    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(new TextileImageViewManager(reactContext));
    }
}
