//  Created by react-native-create-bridge

package com.textile.textilenode;

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

import mobile.Event;
import mobile.Messenger;
import mobile.Mobile;
import mobile.NodeConfig;
import mobile.Wrapper;

import java.util.HashMap;
import java.util.Map;

public class TextileNodeModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "TextileNode";
    private static ReactApplicationContext reactContext = null;
    private static Wrapper node = null;

    public TextileNodeModule(ReactApplicationContext context) {
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
        return new HashMap<>();
    }

    @ReactMethod
    public void create (String dataDir, String apiUrl, String logLevel, Boolean logFiles, Promise promise) {
        if (node == null) {
            try {
                NodeConfig config = new NodeConfig();
                config.setRepoPath(dataDir);
                config.setCentralApiURL(apiUrl);
                config.setLogLevel(logLevel);
                config.setLogFiles(logFiles);
                node = Mobile.newNode(config, new Messenger() {
                    @Override
                    public void notify(Event event) {
                        try {
                            WritableMap payload = JsonConvert.jsonToReact(new JSONObject(event.getPayload()));
                            TextileNodeModule.emitDeviceEvent(event.getName(), payload);
                        }
                        catch (Exception e) {
                            //
                        }
                    }
                });
                promise.resolve(true);
            } catch (Exception e) {
                promise.reject("CREATE NODE ERROR", e);
            }
        } else {
            promise.resolve(true);
        }
    }

    @ReactMethod
    public void start (Promise promise) {
        try {
            node.start();
            promise.resolve(true);
        }
        catch (Exception e) {
            promise.reject("START ERROR", e);
        }
    }

    @ReactMethod
    public void stop (Promise promise) {
        try {
            node.stop();
            promise.resolve(true);
        }
        catch (Exception e) {
            promise.reject("STOP ERROR", e);
        }
    }

    @ReactMethod
    public void signUpWithEmail (String username, String password, String email, String referral, Promise promise) {
        try {
            node.signUpWithEmail(username, password, email, referral);
            promise.resolve(true);
        }
        catch (Exception e) {
            promise.reject("SIGNUP WITH EMAIL ERROR", e);
        }
    }

    @ReactMethod
    public void signIn (String username, String password, Promise promise) {
        try {
            node.signIn(username, password);
            promise.resolve(true);
        }
        catch (Exception e) {
            promise.reject("SIGNIN ERROR", e);
        }
    }

    @ReactMethod
    public void signOut (Promise promise) {
        try {
            node.signOut();
            promise.resolve(true);
        }
        catch (Exception e) {
            promise.reject("SIGNOUT ERROR", e);
        }
    }

    @ReactMethod
    public Boolean isSignedIn() {
        return node.isSignedIn();
    }

    @ReactMethod
    public void getId (Promise promise) {
        try {
            promise.resolve(node.getId());
        }
        catch (Exception e) {
            promise.reject("GET ID ERROR", e);
        }
    }

    @ReactMethod
    public void getIPFSPeerId (Promise promise) {
        try {
            promise.resolve(node.getIPFSPeerId());
        }
        catch (Exception e) {
            promise.reject("GET IPFS PEER ID ERROR", e);
        }
    }

    @ReactMethod
    public void getUsername (Promise promise) {
        try {
            promise.resolve(node.getUsername());
        }
        catch (Exception e) {
            promise.reject("GET USERNAME ERROR", e);
        }
    }

    @ReactMethod
    public void getAccessToken (Promise promise) {
        try {
            promise.resolve(node.getAccessToken());
        }
        catch (Exception e) {
            promise.reject("GET ACCESS TOKEN ERROR", e);
        }
    }

    @ReactMethod
    public void addThread (String name, String mnemonic, Promise promise) {
        try {
            node.addThread(name, mnemonic);
            promise.resolve(null);
        }
        catch (Exception e) {
            promise.reject("ADD THREAD ERROR", e);
        }
    }

    @ReactMethod
    public void addPhoto (String path, String threadName, String caption, Promise promise) {
        try {
            MultipartRequest multipart = node.addPhoto(path, threadName, caption);
            WritableMap map = new WritableNativeMap();
            map.putString("payloadPath", multipart.getPayloadPath());
            map.putString("boundary", multipart.getBoundary());
            promise.resolve(map);

        }
        catch (Exception e) {
            promise.reject("ADD PHOTO ERROR", e);
        }
    }

    @ReactMethod
    public void sharePhoto (String id, String threadName, String caption, Promise promise) {
        try {
            promise.resolve(node.sharePhoto(id, threadName, caption));

        }
        catch (Exception e) {
            promise.reject("SHARE PHOTO ERROR", e);
        }
    }

    @ReactMethod
    public void getPhotos (String offset, Integer limit, String threadName, Promise promise) {
        try {
            String jsonString = node.getPhotos(offset, limit, threadName);
            // convert response to json
            JSONObject obj = new JSONObject(jsonString);
            WritableArray array = new WritableNativeArray();
            JSONArray jsonArray = obj.getJSONArray("items");
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
    public void getFileBase64 (String id, String path, Promise promise) {
        try {
            promise.resolve(node.getFileBase64(id, path));
        }
        catch (Exception e) {
            promise.reject("GET FILE BASE64 ERROR", e);
        }
    }

    @ReactMethod
    public void pairDevice (String pkb64, Promise promise) {
        try {
            node.pairDevice(pkb64);
            promise.resolve(true);
        }
        catch (Exception e) {
            promise.reject("PAIR DEVICE ERROR", e);
        }
    }

    // Method for turning photo URI into path + ext
    @ReactMethod
    public void getFilePath(String uriString, Promise promise) {
        Uri uri = Uri.parse(uriString);
        try {
            promise.resolve(RealPathUtil.getRealPath(reactContext, uri));
        } catch (Exception ex) {
            promise.reject("GET FILE PATH ERROR", ex);
        }
    }

    private static void emitDeviceEvent(String eventName, @Nullable WritableMap eventData) {
        // A method for emitting from the native side to JS
        // https://facebook.github.io/react-native/docs/native-modules-android.html#sending-events-to-javascript
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, eventData);
    }
}
