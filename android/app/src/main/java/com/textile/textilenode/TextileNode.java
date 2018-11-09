//  Created by react-native-create-bridge

package com.textile.textilenode;

import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import mobile.Event;
import mobile.Messenger;
import mobile.Mobile;
import mobile.Mobile_;
import mobile.NodeConfig;

public class TextileNode extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "TextileNode";
    private static ReactApplicationContext reactContext = null;
    static Mobile_ node = null;

    private Executor executor = Executors.newSingleThreadExecutor();

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

    @ReactMethod
    public void create (final String dataDir, final String cafeUrl, final String logLevel, final Boolean logFiles, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                if (node == null) {
                    try {
                        NodeConfig config = new NodeConfig();
                        config.setRepoPath(dataDir);
                        config.setCafeAddr(cafeUrl);
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
        });
    }

    @ReactMethod
    public void mnemonic (final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    String mnemonic = node.getMnemonic();
                    if (mnemonic.length() > 0) {
                        promise.resolve(mnemonic);
                    } else {
                        promise.reject("MNEMONIC ERROR", "Mnemonic unavailable.");
                    }
                }
                catch (Exception e) {
                    promise.reject("START ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void start (final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.start();
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("START ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void stop (final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.stop();
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("STOP ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void signUpWithEmail (final String email, final String username, final String password, final String referral, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.signUpWithEmail(email, username, password, referral);
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("SIGNUP WITH EMAIL ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void signIn (final String username, final String password, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.signIn(username, password);
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("SIGNIN ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void signOut (final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.signOut();
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("SIGNOUT ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void isSignedIn (final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.isSignedIn());
                }
                catch (Exception e) {
                    promise.reject("IS SIGNED IN ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void setAvatarId (final String photoId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.setAvatarId(photoId);
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("SET AVATAR ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void getProfile (final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.getProfile());
                }
                catch (Exception e) {
                    promise.reject("GET PROFILE ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void getPeerProfile (final String peerId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.getPeerProfile(peerId));
                }
                catch (Exception e) {
                    promise.reject("GET PEER PROFILE ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void getPubKey (final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.getPubKey());
                }
                catch (Exception e) {
                    promise.reject("GET PUBLIC KEY ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void getId (final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.getId());
                }
                catch (Exception e) {
                    promise.reject("GET ID ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void getUsername (final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.getUsername());
                }
                catch (Exception e) {
                    promise.reject("GET USERNAME ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void getTokens (final Boolean force, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.getTokens(force));
                }
                catch (Exception e) {
                    promise.reject("GET TOKENS ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void getOverview (final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.overview());
                }
                catch (Exception e) {
                    promise.reject("GET OVERVIEW ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void getContacts (final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.contacts());
                }
                catch (Exception e) {
                    promise.reject("GET CONTACT ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void addThread (final String name, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.addThread(name));
                }
                catch (Exception e) {
                    promise.reject("ADD THREAD ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void removeThread (final String threadId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.removeThread(threadId));
                }
                catch (Exception e) {
                    promise.reject("REMOVE THREAD ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void threads (final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.threads());
                }
                catch (Exception e) {
                    promise.reject("GET THREADS ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void addThreadInvite (final String threadId, final String inviteePk, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.addThreadInvite(threadId, inviteePk));
                }
                catch (Exception e) {
                    promise.reject("ADD EXTERNAL INVITE ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void addExternalThreadInvite (final String threadId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.addExternalThreadInvite(threadId));
                }
                catch (Exception e) {
                    promise.reject("ADD EXTERNAL INVITE ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void acceptExternalThreadInvite (final String threadId, final String key, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.acceptExternalThreadInvite(threadId, key));
                }
                catch (Exception e) {
                    promise.reject("ACCEPT EXTERNAL INVITE ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void addPhoto (final String path, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.addPhoto(path));
                }
                catch (Exception e) {
                    promise.reject("ADD PHOTO ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void addPhotoToThread (final String photoId, final String key, final String threadId, final String caption, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    String c = caption;
                    if (c == null) {
                        c = "";
                    }
                    promise.resolve(node.addPhotoToThread(photoId, key, threadId, c));
                }
                catch (Exception e) {
                    promise.reject("SHARE PHOTO ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void sharePhotoToThread (final String photoId, final String threadId, final String caption, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    String c = caption;
                    if (c == null) {
                        c = "";
                    }
                    promise.resolve(node.sharePhotoToThread(photoId, threadId, c));
                }
                catch (Exception e) {
                    promise.reject("SHARE PHOTO ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void getPhotos (final String offset, final Integer limit, final String threadId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.getPhotos(offset, limit, threadId));
                }
                catch (Exception e) {
                    promise.reject("GET PHOTO BLOCKS ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void getPhotoData (final String photoId, final String path, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.getPhotoData(photoId, path));
                }
                catch (Exception e) {
                    promise.reject("GET BLOCK DATA ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void ignorePhoto (final String blockId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.ignorePhoto(blockId));
                }
                catch (Exception e) {
                    promise.reject("IGNORE PHOTO ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void addPhotoComment (final String blockId, final String body, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.addPhotoComment(blockId, body));
                }
                catch (Exception e) {
                    promise.reject("ADD PHOTO COMMENT ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void ignorePhotoComment (final String blockId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.ignorePhotoComment(blockId));
                }
                catch (Exception e) {
                    promise.reject("IGNORE PHOTO COMMENT ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void addPhotoLike (final String blockId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.addPhotoLike(blockId));
                }
                catch (Exception e) {
                    promise.reject("ADD PHOTO LIKE ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void ignorePhotoLike (final String blockId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.ignorePhotoLike(blockId));
                }
                catch (Exception e) {
                    promise.reject("IGNORE PHOTO LIKE ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void getPhotoThreads (final String photoId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.photoThreads(photoId));
                }
                catch (Exception e) {
                    promise.reject("GET PHOTO THREADS ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void getPhotoKey (final String photoId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.getPhotoKey(photoId));
                }
                catch (Exception e) {
                    promise.reject("GET PHOTO KEY ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void addDevice (final String name, final String pubKey, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.addDevice(name, pubKey);
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("ADD DEVICE ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void removeDevice (final String deviceId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.removeDevice(deviceId);
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("REMOVE DEVICE ERROR", e);
                }
            }
        });
    }


    @ReactMethod
    public void devices (final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.devices());
                }
                catch (Exception e) {
                    promise.reject("GET DEVICES ERROR", e);
                }
            }
        });
    }


    @ReactMethod
    public void refreshMessages (final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.refreshMessages();
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("REFRESH MESSAGES ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void getNotifications (final String offset, final Integer limit, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.getNotifications(offset, limit));
                }
                catch (Exception e) {
                    promise.reject("GET NOTIFICATIONS ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void countUnreadNotifications (final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.countUnreadNotifications());
                }
                catch (Exception e) {
                    promise.reject("COUNT NOTIFICATIONS ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void readNotification (final String id, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.readNotification(id);
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("READ NOTIFICATION ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void readAllNotifications (final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.readAllNotifications();
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("READ ALL NOTIFICATIONS ERROR", e);
                }
            }
        });
    }

    @ReactMethod
    public void acceptThreadInviteViaNotification (final String id, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.acceptThreadInviteViaNotification(id));
                }
                catch (Exception e) {
                    promise.reject("READ NOTIFICATION ERROR", e);
                }
            }
        });
    }

    private static void emitDeviceEvent(String eventName, @Nullable WritableMap eventData) {
        // A method for emitting from the native side to JS
        // https://facebook.github.io/react-native/docs/native-modules-android.html#sending-events-to-javascript
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, eventData);
    }
}
