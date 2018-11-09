package com.textile.textilenode;

import android.net.Uri;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class FS extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "FS";
    private static ReactApplicationContext reactContext = null;

    private Executor executor = Executors.newSingleThreadExecutor();

    public FS(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    // Android specific method for turning photo URI into path + ext
    @ReactMethod
    public void getFilePath(final String uriString, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                Uri uri = Uri.parse(uriString);
                try {
                    String path = RealPathUtil.getRealPath(reactContext, uri);
                    promise.resolve(path);
                } catch (Exception ex) {
                    promise.reject("GET FILE PATH ERROR", ex);
                }
            }
        });
    }
}
