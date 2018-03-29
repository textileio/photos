//  Created by react-native-create-bridge

package com.textilephotos.textileipfs;

import android.support.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import mobile.Mobile;
import mobile.Node;

import java.util.HashMap;
import java.util.Map;

public class TextileIPFSModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "TextileIPFS";
    private static ReactApplicationContext reactContext = null;
    private static Node textile = null;

    public TextileIPFSModule(ReactApplicationContext context) {
        // Pass in the context to the constructor and save it so you can emit events
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        super(context);

        reactContext = context;
    }

    @Override
    public String getName() {
        // Tell React the name of the module
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        return REACT_CLASS;
    }

    @Override
    public Map<String, Object> getConstants() {
        // Export any constants to be used in your native module
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        final Map<String, Object> constants = new HashMap<>();
        constants.put("EXAMPLE_CONSTANT", TextileIPFSModule.REACT_CLASS);
        return constants;
    }

    @ReactMethod
    public void createNodeWithDataDir (String dataDir, String apiHost) {
        textile = Mobile.newTextile(dataDir, apiHost);
    }

    @ReactMethod
    public void startNode (Promise promise) {
        try {
            textile.start();
            promise.resolve(true);
        }
        catch (Exception e) {
            promise.reject("START ERROR", e);
        }
    }

    @ReactMethod
    public void stopNode (Promise promise) {
        try {
            textile.stop();
            promise.resolve(true);
        }
        catch (Exception e) {
            promise.reject("STOP ERROR", e);
        }
    }

    @ReactMethod
    public void addImageAtPath (String path, String thumb, Promise promise) {
        try {
            String hash = textile.addPhoto(path, thumb);
            promise.resolve(hash);
        }
        catch (Exception e) {
            promise.reject("ADD IMAGE ERROR", e);
        }
    }

    @ReactMethod
    public void getPhotos (String offset, Integer limit, Promise promise) {
        try {
            String hashString = textile.getPhotos(offset, limit);
            promise.resolve(hashString);
        }
        catch (Exception e) {
            promise.reject("GET PHOTOS ERROR", e);
        }
    }

    @ReactMethod
    public void getPhotoData (String path, Promise promise) {
        try {
            String result = textile.getPhotoBase64String(path);
            promise.resolve(result);
        }
        catch (Exception e) {
            promise.reject("GET DATA ERROR", e);
        }
    }

    @ReactMethod
    public void exampleMethod () {
        // An example native method that you will expose to React
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
    }

    private static void emitDeviceEvent(String eventName, @Nullable WritableMap eventData) {
        // A method for emitting from the native side to JS
        // https://facebook.github.io/react-native/docs/native-modules-android.html#sending-events-to-javascript
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, eventData);
    }
}
