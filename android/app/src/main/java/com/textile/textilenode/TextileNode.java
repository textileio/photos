package com.textile.textilenode;

import android.support.annotation.Nullable;
import android.util.Base64;

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
import mobile.Callback;

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
    public void addContact(final String id_, final String address, final String username, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.addContact(id_, address, username);
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("addContact", e);
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
    public void addPeerToThread(final String id_, final String threadId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.addPeerToThread(id_, threadId);
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("addPeerToThread", e);
                }
            }
        });
    }

    @ReactMethod
    public void addSchema(final String jsonstr, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.addSchema(jsonstr));
                }
                catch (Exception e) {
                    promise.reject("addSchema", e);
                }
            }
        });
    }

    @ReactMethod
    public void addThread(final String key, final String name, final Boolean shared, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.addThread(key, name, shared));
                }
                catch (Exception e) {
                    promise.reject("addThread", e);
                }
            }
        });
    }

    @ReactMethod
    public void addThreadComment(final String blockId, final String body, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.addThreadComment(blockId, body));
                }
                catch (Exception e) {
                    promise.reject("addThreadComment", e);
                }
            }
        });
    }

    @ReactMethod
    public void addThreadFiles(final String dir, final String threadId, final String caption, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    byte[] bytes = dir.getBytes();
                    promise.resolve(node.addThreadFiles(bytes, threadId, caption));
                }
                catch (Exception e) {
                    promise.reject("addThreadFiles", e);
                }
            }
        });
    }

    @ReactMethod
    public void addThreadFilesByTarget(final String target, final String threadId, final String caption, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.addThreadFilesByTarget(target, threadId, caption));
                }
                catch (Exception e) {
                    promise.reject("addThreadFilesByTarget", e);
                }
            }
        });
    }

    @ReactMethod
    public void addThreadIgnore(final String blockId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.addThreadIgnore(blockId));
                }
                catch (Exception e) {
                    promise.reject("addThreadIgnore", e);
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
    public void addThreadLike(final String blockId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.addThreadLike(blockId));
                }
                catch (Exception e) {
                    promise.reject("addThreadLike", e);
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
    public void checkCafeMessages(final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.checkCafeMessages();
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("checkCafeMessages", e);
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
    public void fileData(final String hash, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.fileData(hash));
                }
                catch (Exception e) {
                    promise.reject("fileData", e);
                }
            }
        });
    }

    @ReactMethod
    public void ignoreThreadInviteViaNotification(final String id_, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.ignoreThreadInviteViaNotification(id_);
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("ignoreThreadInviteViaNotification", e);
                }
            }
        });
    }

    @ReactMethod
    public void imageFileDataForMinWidth(final String pth, final Integer minWidth, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.imageFileDataForMinWidth(pth, minWidth));
                }
                catch (Exception e) {
                    promise.reject("imageFileDataForMinWidth", e);
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
    public void prepareFiles(final String path, final String threadId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    byte[] bytes = node.prepareFiles(path, threadId);
                    String base64 = Base64.encodeToString(bytes, Base64.DEFAULT);
                    promise.resolve(base64);
                }
                catch (Exception e) {
                    promise.reject("prepareFiles", e);
                }
            }
        });
    }

    @ReactMethod
    public void prepareFilesAsync(final String path, final String threadId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    node.prepareFilesAsync(path, threadId, new Callback() {
                        @Override
                        public void call(byte[] bytes, Exception e) {
                            if (e == null) {
                                String base64 = Base64.encodeToString(bytes, Base64.DEFAULT);
                                promise.resolve(base64);
                            } else {
                                promise.reject("prepareFilesAsync", e);
                            }
                        }
                    });
                }
                catch (Exception e) {
                    promise.reject("prepareFilesAsync", e);
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
    public void threadFiles(final String offset, final Integer limit, final String threadId, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    promise.resolve(node.threadFiles(offset, limit, threadId));
                }
                catch (Exception e) {
                    promise.reject("threadFiles", e);
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
    public void initRepo(final String seed, final String repoPath, final Boolean logToDisk, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    InitConfig config = new InitConfig();
                    config.setSeed(seed);
                    config.setRepoPath(repoPath);
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
    public void newTextile(final String repoPath, final String logLevels, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                if (node == null) {
                    try {
                        RunConfig config = new RunConfig();
                        config.setRepoPath(repoPath);
                        config.setLogLevels(logLevels);
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
