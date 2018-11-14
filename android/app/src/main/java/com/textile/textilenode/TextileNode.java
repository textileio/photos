package com.textile.textilenode;

import android.support.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONObject;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import mobile.Event;
import mobile.Messenger;
import mobile.Mobile;
import mobile.Mobile_;
import mobile.InitConfig;
import mobile.MigrateConfig;
import mobile.RunConfig;

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
    public void acceptExternalThreadInvite(final String id_, final String key, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.acceptExternalThreadInvite(id_, key));
                }
                catch (Exception e) {
                    promise.reject("acceptExternalThreadInvite", e);
                }
            }
        });
    }

    @ReactMethod
    public void acceptThreadInviteViaNotification(final String id_, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.acceptThreadInviteViaNotification(id_));
                }
                catch (Exception e) {
                    promise.reject("acceptThreadInviteViaNotification", e);
                }
            }
        });
    }

    @ReactMethod
    public void addExternalThreadInvite(final String threadId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.addExternalThreadInvite(threadId));
                }
                catch (Exception e) {
                    promise.reject("addExternalThreadInvite", e);
                }
            }
        });
    }

    @ReactMethod
    public void addPhoto(final String path, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.addPhoto(path));
                }
                catch (Exception e) {
                    promise.reject("addPhoto", e);
                }
            }
        });
    }

    @ReactMethod
    public void addPhotoComment(final String blockId, final String body, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.addPhotoComment(blockId, body));
                }
                catch (Exception e) {
                    promise.reject("addPhotoComment", e);
                }
            }
        });
    }

    @ReactMethod
    public void addPhotoLike(final String blockId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.addPhotoLike(blockId));
                }
                catch (Exception e) {
                    promise.reject("addPhotoLike", e);
                }
            }
        });
    }

    @ReactMethod
    public void addPhotoToThread(final String dataId, final String key, final String threadId, final String caption, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    String c = caption != null ? caption : "";
                    promise.resolve(node.addPhotoToThread(dataId, key, threadId, c));
                }
                catch (Exception e) {
                    promise.reject("addPhotoToThread", e);
                }
            }
        });
    }

    @ReactMethod
    public void addThread(final String name, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.addThread(name));
                }
                catch (Exception e) {
                    promise.reject("addThread", e);
                }
            }
        });
    }

    @ReactMethod
    public void addThreadInvite(final String threadId, final String inviteeId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.addThreadInvite(threadId, inviteeId));
                }
                catch (Exception e) {
                    promise.reject("addThreadInvite", e);
                }
            }
        });
    }

    @ReactMethod
    public void address(final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.address());
                }
                catch (Exception e) {
                    promise.reject("address", e);
                }
            }
        });
    }

    @ReactMethod
    public void cafeSession(final String peerId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.cafeSession(peerId));
                }
                catch (Exception e) {
                    promise.reject("cafeSession", e);
                }
            }
        });
    }

    @ReactMethod
    public void cafeSessions(final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.cafeSessions());
                }
                catch (Exception e) {
                    promise.reject("cafeSessions", e);
                }
            }
        });
    }

    @ReactMethod
    public void checkCafeMail(final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.checkCafeMail();
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("checkCafeMail", e);
                }
            }
        });
    }

    @ReactMethod
    public void contact(final String id_, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.contact(id_));
                }
                catch (Exception e) {
                    promise.reject("contact", e);
                }
            }
        });
    }

    @ReactMethod
    public void contactThreads(final String id_, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.contactThreads(id_));
                }
                catch (Exception e) {
                    promise.reject("contactThreads", e);
                }
            }
        });
    }

    @ReactMethod
    public void contactUsername(final String id_, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.contactUsername(id_));
                }
                catch (Exception e) {
                    promise.reject("contactUsername", e);
                }
            }
        });
    }

    @ReactMethod
    public void contacts(final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.contacts());
                }
                catch (Exception e) {
                    promise.reject("contacts", e);
                }
            }
        });
    }

    @ReactMethod
    public void countUnreadNotifications(final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.countUnreadNotifications());
                }
                catch (Exception e) {
                    promise.reject("countUnreadNotifications", e);
                }
            }
        });
    }

    @ReactMethod
    public void deregisterCafe(final String peerId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.deregisterCafe(peerId);
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("deregisterCafe", e);
                }
            }
        });
    }

    @ReactMethod
    public void ignorePhoto(final String blockId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.ignorePhoto(blockId));
                }
                catch (Exception e) {
                    promise.reject("ignorePhoto", e);
                }
            }
        });
    }

    @ReactMethod
    public void ignorePhotoComment(final String blockId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.ignorePhotoComment(blockId));
                }
                catch (Exception e) {
                    promise.reject("ignorePhotoComment", e);
                }
            }
        });
    }

    @ReactMethod
    public void ignorePhotoLike(final String blockId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.ignorePhotoLike(blockId));
                }
                catch (Exception e) {
                    promise.reject("ignorePhotoLike", e);
                }
            }
        });
    }

    @ReactMethod
    public void notifications(final String offset, final Integer limit, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.notifications(offset, limit));
                }
                catch (Exception e) {
                    promise.reject("notifications", e);
                }
            }
        });
    }

    @ReactMethod
    public void overview(final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.overview());
                }
                catch (Exception e) {
                    promise.reject("overview", e);
                }
            }
        });
    }

    @ReactMethod
    public void peerId(final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.peerId());
                }
                catch (Exception e) {
                    promise.reject("peerId", e);
                }
            }
        });
    }

    @ReactMethod
    public void peerProfile(final String peerId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.peerProfile(peerId));
                }
                catch (Exception e) {
                    promise.reject("peerProfile", e);
                }
            }
        });
    }

    @ReactMethod
    public void photoData(final String id_, final String path, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.photoData(id_, path));
                }
                catch (Exception e) {
                    promise.reject("photoData", e);
                }
            }
        });
    }

    @ReactMethod
    public void photoDataForMinWidth(final String id_, final Integer minWidth, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.photoDataForMinWidth(id_, minWidth));
                }
                catch (Exception e) {
                    promise.reject("photoDataForMinWidth", e);
                }
            }
        });
    }

    @ReactMethod
    public void photoKey(final String id_, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.photoKey(id_));
                }
                catch (Exception e) {
                    promise.reject("photoKey", e);
                }
            }
        });
    }

    @ReactMethod
    public void photoMetadata(final String id_, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.photoMetadata(id_));
                }
                catch (Exception e) {
                    promise.reject("photoMetadata", e);
                }
            }
        });
    }

    @ReactMethod
    public void photoThreads(final String id_, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.photoThreads(id_));
                }
                catch (Exception e) {
                    promise.reject("photoThreads", e);
                }
            }
        });
    }

    @ReactMethod
    public void photos(final String offset, final Integer limit, final String threadId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.photos(offset, limit, threadId));
                }
                catch (Exception e) {
                    promise.reject("photos", e);
                }
            }
        });
    }

    @ReactMethod
    public void profile(final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.profile());
                }
                catch (Exception e) {
                    promise.reject("profile", e);
                }
            }
        });
    }

    @ReactMethod
    public void readAllNotifications(final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.readAllNotifications();
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("readAllNotifications", e);
                }
            }
        });
    }

    @ReactMethod
    public void readNotification(final String id_, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.readNotification(id_);
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("readNotification", e);
                }
            }
        });
    }

    @ReactMethod
    public void refreshCafeSession(final String cafeId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.refreshCafeSession(cafeId));
                }
                catch (Exception e) {
                    promise.reject("refreshCafeSession", e);
                }
            }
        });
    }

    @ReactMethod
    public void registerCafe(final String peerId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.registerCafe(peerId);
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("registerCafe", e);
                }
            }
        });
    }

    @ReactMethod
    public void removeThread(final String id_, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.removeThread(id_));
                }
                catch (Exception e) {
                    promise.reject("removeThread", e);
                }
            }
        });
    }

    @ReactMethod
    public void seed(final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.seed());
                }
                catch (Exception e) {
                    promise.reject("seed", e);
                }
            }
        });
    }

    @ReactMethod
    public void setAvatar(final String id_, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.setAvatar(id_);
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("setAvatar", e);
                }
            }
        });
    }

    @ReactMethod
    public void setUsername(final String username, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.setUsername(username);
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("setUsername", e);
                }
            }
        });
    }

    @ReactMethod
    public void sharePhotoToThread(final String dataId, final String threadId, final String caption, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    String c = caption != null ? caption : "";
                    promise.resolve(node.sharePhotoToThread(dataId, threadId, c));

                }
                catch (Exception e) {
                    promise.reject("sharePhotoToThread", e);
                }
            }
        });
    }

    @ReactMethod
    public void start(final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.start();
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("start", e);
                }
            }
        });
    }

    @ReactMethod
    public void stop(final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.stop();
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("stop", e);
                }
            }
        });
    }

    @ReactMethod
    public void threadInfo(final String threadId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.threadInfo(threadId));
                }
                catch (Exception e) {
                    promise.reject("threadInfo", e);
                }
            }
        });
    }

    @ReactMethod
    public void threads(final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.threads());
                }
                catch (Exception e) {
                    promise.reject("threads", e);
                }
            }
        });
    }

    @ReactMethod
    public void username(final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.username());
                }
                catch (Exception e) {
                    promise.reject("username", e);
                }
            }
        });
    }

    @ReactMethod
    public void version(final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.version());
                }
                catch (Exception e) {
                    promise.reject("version", e);
                }
            }
        });
    }

    @ReactMethod
    public void initRepo(final String seed, final String repoPath, final String logLevel, final Boolean logToDisk, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    InitConfig config = new InitConfig();
                    config.setSeed(seed);
                    config.setRepoPath(repoPath);
                    config.setLogLevel(logLevel);
                    config.setLogToDisk(logToDisk);
                    Mobile.initRepo(config);
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("initRepo", e);
                }
            }
        });
    }

    @ReactMethod
    public void migrateRepo(final String repoPath, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    MigrateConfig config = new MigrateConfig();
                    config.setRepoPath(repoPath);
                    Mobile.migrateRepo(config);
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("migrateRepo", e);
                }
            }
        });
    }

    @ReactMethod
    public void newTextile(final String repoPath, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                if (node == null) {
                    try {
                        RunConfig config = new RunConfig();
                        config.setRepoPath(repoPath);
                        node = Mobile.newTextile(config, new Messenger() {
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
                    }
                    catch (Exception e) {
                        promise.reject("newTextile", e);
                    }
                } else {
                    promise.resolve(null);
                }
            }
        });
    }

    @ReactMethod
    public void newWallet(final Integer wordCount, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(Mobile.newWallet(wordCount));
                }
                catch (Exception e) {
                    promise.reject("newWallet", e);
                }
            }
        });
    }

    @ReactMethod
    public void walletAccountAt(final String phrase, final Integer index, final String password, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    String p = password != null ? password : "";
                    promise.resolve(Mobile.walletAccountAt(phrase, index, p));
                }
                catch (Exception e) {
                    promise.reject("walletAccountAt", e);
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
