//  Created by react-native-create-bridge

package com.textile.textilenode;

import android.net.Uri;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import net.MultipartRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import mobile.Event;
import mobile.Messenger;
import mobile.Mobile;
import mobile.NodeConfig;
import mobile.Wrapper;

public class TextileNode extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "TextileNode";
    private static ReactApplicationContext reactContext = null;
    static Wrapper node = null;

    public TextileNode(ReactApplicationContext context) {
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
        constants.put("EXAMPLE_CONSTANT", TextileNode.REACT_CLASS);
        return constants;
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
                            TextileNode.emitDeviceEvent(event.getName(), payload);
                        }
                        catch (Exception e) {
                            //
                        }
                    }
                });
                promise.resolve(null);
            } catch (Exception e) {
                promise.reject("CREATE NODE ERROR", e);
            }
        } else {
            promise.resolve(null);
        }
    }

    @ReactMethod
    public void start (Promise promise) {
        try {
            node.start();
            promise.resolve(null);
        }
        catch (Exception e) {
            promise.reject("START ERROR", e);
        }
    }

    @ReactMethod
    public void stop (Promise promise) {
        try {
            node.stop();
            promise.resolve(null);
        }
        catch (Exception e) {
            promise.reject("STOP ERROR", e);
        }
    }

    @ReactMethod
    public void signUpWithEmail (String username, String password, String email, String referral, Promise promise) {
        try {
            node.signUpWithEmail(username, password, email, referral);
            promise.resolve(null);
        }
        catch (Exception e) {
            promise.reject("SIGNUP WITH EMAIL ERROR", e);
        }
    }

    @ReactMethod
    public void signIn (String username, String password, Promise promise) {
        try {
            node.signIn(username, password);
            promise.resolve(null);
        }
        catch (Exception e) {
            promise.reject("SIGNIN ERROR", e);
        }
    }

    @ReactMethod
    public void signOut (Promise promise) {
        try {
            node.signOut();
            promise.resolve(null);
        }
        catch (Exception e) {
            promise.reject("SIGNOUT ERROR", e);
        }
    }

    @ReactMethod
    public void isSignedIn (Promise promise) {
        try {
            promise.resolve(node.isSignedIn());
        }
        catch (Exception e) {
            promise.reject("IS SIGNED IN ERROR", e);
        }
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
            if (caption == null) {
                caption = "";
            }
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
            if (caption == null) {
                caption = "";
            }
            promise.resolve(node.sharePhoto(id, threadName, caption));
        }
        catch (Exception e) {
            promise.reject("SHARE PHOTO ERROR", e);
        }
    }

    @ReactMethod
    public void getPhotoBlocks (String offset, Integer limit, String threadName, Promise promise) {
        try {
            String jsonString = node.getPhotoBlocks(offset, limit, threadName);
            // convert response to json
            JSONObject obj = new JSONObject(jsonString);
            JSONArray jsonArray = obj.optJSONArray("items");
            if (jsonArray == null) {
                jsonArray = new JSONArray();
            }
            WritableArray array = TextileNode.convertJsonToArray(jsonArray);
            promise.resolve(array);
        }
        catch (Exception e) {
            promise.reject("GET PHOTO BLOCKS ERROR", e);
        }
    }

    @ReactMethod
    public void getBlockData (String id, String path, Promise promise) {
        try {
            promise.resolve(node.getBlockData(id, path));
        }
        catch (Exception e) {
            promise.reject("GET BLOCK DATA ERROR", e);
        }
    }

    @ReactMethod
    public void getFileData (String id, String path, Promise promise) {
        try {
            promise.resolve(node.getFileData(id, path));
        }
        catch (Exception e) {
            promise.reject("GET FILE DATA ERROR", e);
        }
    }

    @ReactMethod
    public void pairDevice (String pkb64, Promise promise) {
        try {
            promise.resolve(node.pairDevice(pkb64));
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
            String path = RealPathUtil.getRealPath(reactContext, uri);
            promise.resolve(path);
        } catch (Exception ex) {
            promise.reject("GET FILE PATH ERROR", ex);
        }
    }

    private static void emitDeviceEvent(String eventName, @Nullable WritableMap eventData) {
        // A method for emitting from the native side to JS
        // https://facebook.github.io/react-native/docs/native-modules-android.html#sending-events-to-javascript
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, eventData);
    }

    private static WritableMap convertJsonToMap(JSONObject jsonObject) throws JSONException {
        WritableMap map = new WritableNativeMap();

        Iterator<String> iterator = jsonObject.keys();
        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = jsonObject.get(key);
            if (value instanceof JSONObject) {
                map.putMap(key, convertJsonToMap((JSONObject) value));
            } else if (value instanceof  JSONArray) {
                map.putArray(key, convertJsonToArray((JSONArray) value));
            } else if (value instanceof  Boolean) {
                map.putBoolean(key, (Boolean) value);
            } else if (value instanceof  Integer) {
                map.putInt(key, (Integer) value);
            } else if (value instanceof  Double) {
                map.putDouble(key, (Double) value);
            } else if (value instanceof String)  {
                map.putString(key, (String) value);
            } else {
                map.putString(key, value.toString());
            }
        }
        return map;
    }

    private static WritableArray convertJsonToArray(JSONArray jsonArray) throws JSONException {
        WritableArray array = new WritableNativeArray();

        for (int i = 0; i < jsonArray.length(); i++) {
            Object value = jsonArray.get(i);
            if (value instanceof JSONObject) {
                array.pushMap(convertJsonToMap((JSONObject) value));
            } else if (value instanceof  JSONArray) {
                array.pushArray(convertJsonToArray((JSONArray) value));
            } else if (value instanceof  Boolean) {
                array.pushBoolean((Boolean) value);
            } else if (value instanceof  Integer) {
                array.pushInt((Integer) value);
            } else if (value instanceof  Double) {
                array.pushDouble((Double) value);
            } else if (value instanceof String)  {
                array.pushString((String) value);
            } else {
                array.pushString(value.toString());
            }
        }
        return array;
    }

    private static JSONObject convertMapToJson(ReadableMap readableMap) throws JSONException {
        JSONObject object = new JSONObject();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (readableMap.getType(key)) {
                case Null:
                    object.put(key, JSONObject.NULL);
                    break;
                case Boolean:
                    object.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    object.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    object.put(key, readableMap.getString(key));
                    break;
                case Map:
                    object.put(key, convertMapToJson(readableMap.getMap(key)));
                    break;
                case Array:
                    object.put(key, convertArrayToJson(readableMap.getArray(key)));
                    break;
            }
        }
        return object;
    }

    private static JSONArray convertArrayToJson(ReadableArray readableArray) throws JSONException {
        JSONArray array = new JSONArray();
        for (int i = 0; i < readableArray.size(); i++) {
            switch (readableArray.getType(i)) {
                case Null:
                    break;
                case Boolean:
                    array.put(readableArray.getBoolean(i));
                    break;
                case Number:
                    array.put(readableArray.getDouble(i));
                    break;
                case String:
                    array.put(readableArray.getString(i));
                    break;
                case Map:
                    array.put(convertMapToJson(readableArray.getMap(i)));
                    break;
                case Array:
                    array.put(convertArrayToJson(readableArray.getArray(i)));
                    break;
            }
        }
        return array;
    }
}
