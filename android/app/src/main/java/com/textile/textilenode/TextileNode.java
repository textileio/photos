//  Created by react-native-create-bridge

package com.textile.textilenode;

import android.net.Uri;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import mobile.Event;
import mobile.Messenger;
import mobile.Mobile;
import mobile.Mobile_;
import mobile.NodeConfig;

public class TextileNode extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "TextileNode";
    private static ReactApplicationContext reactContext = null;
    static Mobile_ node = null;

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
            promise.resolve(node.addThread(name, mnemonic));
        }
        catch (Exception e) {
            promise.reject("ADD THREAD ERROR", e);
        }
    }

    @ReactMethod
    public void removeThread (String threadId, Promise promise) {
        try {
            promise.resolve(node.removeThread(threadId));
        }
        catch (Exception e) {
            promise.reject("REMOVE THREAD ERROR", e);
        }
    }

    @ReactMethod
    public void threads (Promise promise) {
        try {
            promise.resolve(node.threads());
        }
        catch (Exception e) {
            promise.reject("GET THREADS ERROR", e);
        }
    }

    @ReactMethod
    public void addThreadInvite (String threadId, String inviteeKey, Promise promise) {
        try {
            promise.resolve(node.addThreadInvite(threadId, inviteeKey));
        }
        catch (Exception e) {
            promise.reject("ADD EXTERNAL INVITE ERROR", e);
        }
    }

    @ReactMethod
    public void addExternalThreadInvite (String threadId, Promise promise) {
        try {
            promise.resolve(node.addExternalThreadInvite(threadId));
        }
        catch (Exception e) {
            promise.reject("ADD EXTERNAL INVITE ERROR", e);
        }
    }

    @ReactMethod
    public void acceptExternalThreadInvite (String threadId, String key, Promise promise) {
        try {
            promise.resolve(node.acceptExternalThreadInvite(threadId, key));
        }
        catch (Exception e) {
            promise.reject("ACCEPT EXTERNAL INVITE ERROR", e);
        }
    }

    @ReactMethod
    public void addPhoto (String path, Promise promise) {
        try {
            promise.resolve(node.addPhoto(path));
        }
        catch (Exception e) {
            promise.reject("ADD PHOTO ERROR", e);
        }
    }

    @ReactMethod
    public void addPhotoToThread (String photoId, String key, String threadId, String caption, Promise promise) {
        try {
            if (caption == null) {
                caption = "";
            }
            promise.resolve(node.addPhotoToThread(photoId, key, threadId, caption));
        }
        catch (Exception e) {
            promise.reject("SHARE PHOTO ERROR", e);
        }
    }

    @ReactMethod
    public void sharePhotoToThread (String photoId, String threadId, String caption, Promise promise) {
        try {
            if (caption == null) {
                caption = "";
            }
            promise.resolve(node.sharePhotoToThread(photoId, threadId, caption));
        }
        catch (Exception e) {
            promise.reject("SHARE PHOTO ERROR", e);
        }
    }

    @ReactMethod
    public void getPhotos (String offset, Integer limit, String threadId, Promise promise) {
        try {
            promise.resolve(node.getPhotos(offset, limit, threadId));
        }
        catch (Exception e) {
            promise.reject("GET PHOTO BLOCKS ERROR", e);
        }
    }

    @ReactMethod
    public void getPhotoData (String photoId, Promise promise) {
        try {
            promise.resolve(node.getPhotoData(photoId));
        }
        catch (Exception e) {
            promise.reject("GET BLOCK DATA ERROR", e);
        }
    }

    @ReactMethod
    public void getThumbData (String photoId, Promise promise) {
        try {
            promise.resolve(node.getThumbData(photoId));
        }
        catch (Exception e) {
            promise.reject("GET BLOCK DATA ERROR", e);
        }
    }

    @ReactMethod
    public void getPhotoMetadata (String photoId, Promise promise) {
        try {
            promise.resolve(node.getPhotoMetadata(photoId));
        }
        catch (Exception e) {
            promise.reject("GET BLOCK DATA ERROR", e);
        }
    }

    @ReactMethod
    public void addDevice (String name, String pubKey, Promise promise) {
        try {
            node.addDevice(name, pubKey);
            promise.resolve(null);
        }
        catch (Exception e) {
            promise.reject("ADD DEVICE ERROR", e);
        }
    }

    @ReactMethod
    public void removeDevice (String deviceId, Promise promise) {
        try {
            node.removeDevice(deviceId);
            promise.resolve(null);
        }
        catch (Exception e) {
            promise.reject("REMOVE DEVICE ERROR", e);
        }
    }


    @ReactMethod
    public void devices (Promise promise) {
        try {
            promise.resolve(node.devices());
        }
        catch (Exception e) {
            promise.reject("GET DEVICES ERROR", e);
        }
    }

    // Android specific method for turning photo URI into path + ext
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
}
