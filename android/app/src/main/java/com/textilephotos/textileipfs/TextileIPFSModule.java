//  Created by react-native-create-bridge

package com.textilephotos.textileipfs;

import android.net.Uri;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import net.MultipartRequest;

import org.json.JSONArray;
import org.json.JSONObject;

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
    public void createNodeWithDataDir (String dataDir, String apiUrl, Promise promise) {
        if (textile == null) {
            try {
                textile = Mobile.newNode(dataDir, apiUrl);
                promise.resolve(true);
            } catch (Exception e) {
                promise.reject("START ERROR", e);
            }
        } else {
            promise.resolve(true);
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
            // Grab our add image response
            MultipartRequest multipart = textile.addPhoto(path, thumbPath, thread);
            // Create a Native map
            WritableMap map = new WritableNativeMap();
            // Add the rsponse parts
            map.putString("payloadPath", (String) multipart.getPayloadPath());
            map.putString("boundary", (String) multipart.getBoundary());
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
            // convert string to json
            JSONObject obj = new JSONObject(hashString);
            // create a Native ready array
            WritableArray array = new WritableNativeArray();
            // grab the hashes array out of the response
            JSONArray jsonArray = obj.getJSONArray("hashes");
            // for each hash, add them to our native array
            for (int i = 0; i < jsonArray.length(); i++) {
                Object value = jsonArray.get(i);
                array.pushString((String) value);
            }
            promise.resolve(array);
        }
        catch (Exception e) {
            promise.reject("GET PHOTOS ERROR", e);
        }
    }

    @ReactMethod
    public WritableMap getHashRequest (String hash) {
        try {
            String request = textile.getHashRequest(hash);
            JSONObject obj = new JSONObject(request);
            String host = obj.getString("host");
            String protocol = obj.getString("protocol");
            String token = obj.getString("token");
            WritableMap response = new WritableNativeMap();
            // Add the response parts
            response.putString("host", host);
            response.putString("protocol", protocol);
            response.putString("token", token);
            return response;
        }
        catch (Exception e) {
            return null;
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
            textile.pairDesktop(pkb64);
            promise.resolve(true);
        }
        catch (Exception e) {
            promise.reject("GET DATA ERROR", e);
        }
    }


    @ReactMethod
    public void signIn (String username, String password, Promise promise) {
        try {
            textile.signIn(username, password);
            promise.resolve(true);
        }
        catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void signUpWithEmail (String username, String password, String email, String referral, Promise promise) {
        try {
            textile.signUpWithEmail(username, password, email, referral);
            promise.resolve(true);
        }
        catch (Exception e) {
            promise.reject(e);
        }
    }


    @ReactMethod
    public void getUsername (Promise promise) {
        try {
            String username = textile.getUsername();
            promise.resolve(username);
        }
        catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void signOut (Promise promise) {
        try {
            textile.signOut();
            promise.resolve(true);
        }
        catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getAccessToken (Promise promise) {
        try {
            String token = textile.getAccessToken();
            promise.resolve(token);
        }
        catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public String getGatewayPassword() {
        return textile.getGatewayPassword();
    }

    @ReactMethod
    public Boolean isSignedIn() {
        return textile.isSignedIn();
    }

    // Method for turning photo URI into path + ext
    @ReactMethod
    public void getRealPathFromURI(String uriString, Promise promise) {
        Uri uri = Uri.parse(uriString);
        try {
            String result = RealPathUtil.getRealPath(reactContext, uri);
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
