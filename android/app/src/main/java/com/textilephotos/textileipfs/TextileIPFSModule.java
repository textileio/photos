//  Created by react-native-create-bridge

package com.textilephotos.textileipfs;

import android.content.Context;
import android.net.Uri;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import net.MultipartRequest;

import mobile.Mobile;
import mobile.Wrapper;

import java.util.HashMap;
import java.util.Map;

public class TextileIPFSModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "TextileIPFS";
    private static ReactApplicationContext reactContext = null;
    private static Wrapper textile = null;

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
    public void createNodeWithDataDir (String dataDir, Promise promise) {
        if (textile == null) {
            try {
                textile = Mobile.newNode(dataDir);
                promise.resolve(true);
            } catch (Exception e) {
                promise.reject("START ERROR", e);
            }
        } else {
            promise.resolve(true);
        }
    }

    @ReactMethod
    public void startGateway (Promise promise) {
        try {
            textile.startGateway();
            promise.resolve(true);
        }
        catch (Exception e) {
            promise.reject("START ERROR", e);
        }
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
    public void addImageAtPath (String path, String thumbPath, String thread, Promise promise) {
        try {
            MultipartRequest multipart = textile.addPhoto(path, thumbPath, thread);
            Map<String, String> map = new HashMap<String, String>();
            map.put("payloadPath", multipart.getPayloadPath());
            map.put("boundary", multipart.getBoundary());
            promise.resolve(map);
        }
        catch (Exception e) {
            promise.reject("ADD IMAGE ERROR", e);
        }
    }

    @ReactMethod
    public void getPhotos (String offset, Integer limit, String thread, Promise promise) {
        try {
            String hashString = textile.getPhotos(offset, limit, thread);
            promise.resolve(hashString);
        }
        catch (Exception e) {
            promise.reject("GET PHOTOS ERROR", e);
        }
    }

    @ReactMethod
    public String syncGetPhotoData (String path) {
        try {
            String result = textile.getFileBase64(path);
            if (result != null) {
                return result;
            } else {
                return null;
            }
        }
        catch (Exception e) {
            return null;
        }
    }

    @ReactMethod
    public void getPhotoData (String path, Promise promise) {
        try {
            String result = textile.getFileBase64(path);
            promise.resolve(result);
        }
        catch (Exception e) {
            promise.reject("GET DATA ERROR", e);
        }
    }

    @ReactMethod
    public void pairNewDevice (String pkb64, Promise promise) {
        try {
            String result = textile.pairDesktop(pkb64);
            promise.resolve(result);
        }
        catch (Exception e) {
            promise.reject("GET DATA ERROR", e);
        }
    }

    // Method for turning photo URI into path + ext
    @ReactMethod
    public void getRealPathFromURI(Uri uri, Promise promise) {
        try {
            Context context = getReactApplicationContext();
            String result = RealPathUtil.getRealPath(context, uri);
            promise.resolve(result);
        } catch (Exception ex) {
            promise.reject("URI ERROR", ex);
        }
    }

    private static void emitDeviceEvent(String eventName, @Nullable WritableMap eventData) {
        // A method for emitting from the native side to JS
        // https://facebook.github.io/react-native/docs/native-modules-android.html#sending-events-to-javascript
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, eventData);
    }
}
