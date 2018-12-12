package com.textile.textilenode;

import android.database.Cursor;
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

import java.util.ArrayList;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class CameraRoll extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "CameraRoll";
    private static ReactApplicationContext reactContext = null;

    private Executor executor = Executors.newSingleThreadExecutor();

    public CameraRoll(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void requestLocalPhotos (final int minEpoch, final Promise promise) {
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    // Create a thread to do the lookup on and return results over asyn Events
                    class PhotoLookup implements Runnable {
                        int minEpoch;
                        PhotoLookup(int ep) { minEpoch = ep; }
                        public void run() {
                            // Get our camera bucket
                            final String CAMERA_IMAGE_BUCKET_NAME = Environment.getExternalStorageDirectory().toString()
                                    + "/DCIM/Camera";
                            // Get our bucket ID
                            final String CAMERA_IMAGE_BUCKET_ID = String.valueOf(CAMERA_IMAGE_BUCKET_NAME.toLowerCase().hashCode());
                            // Get the fields we want
                            final String[] projection = {
                                    MediaStore.Images.Media.DATA,
                                    MediaStore.Images.Media.DATE_MODIFIED,
                                    MediaStore.Images.Media.DATE_ADDED,
                                    MediaStore.Images.Media.ORIENTATION
                            };
                            // Setup the query. In our Bucket and with min date
                            final String selection = MediaStore.Images.Media.BUCKET_ID
                                    + " = ? AND "
                                    + MediaStore.Images.Media.DATE_MODIFIED
                                    + " > ?";

                            final String[] selectionArgs = {CAMERA_IMAGE_BUCKET_ID, Integer.toString(minEpoch)};

                            // Query
                            final Cursor cursor = reactContext.getContentResolver().query(
                                    MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                                    projection,
                                    selection,
                                    selectionArgs,
                                    null);

                            ArrayList<String> result = new ArrayList<String>(cursor.getCount());
                            if (cursor.moveToFirst()) {
                                final int pathColumn = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
                                final int modifiedColumn = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATE_MODIFIED);
                                final int createdColumn = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATE_ADDED);
                                final int orientationColumn = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.ORIENTATION);

                                do {
                                    // Grab the values out of the result row
                                    final String path = cursor.getString(pathColumn);
                                    final String modified = cursor.getString(modifiedColumn);
                                    final String created = cursor.getString(createdColumn);
                                    final String orientation = cursor.getString(orientationColumn);

                                    // Send a new event, newLocalPhoto
                                    try {
                                        WritableMap payload = Arguments.createMap();
                                        payload.putString((String) "assetId", path);
                                        payload.putString((String) "path", path);
                                        payload.putString((String) "creationDate", created);
                                        payload.putString((String) "modificationDate", modified);
                                        payload.putInt((String) "orientation", Integer.parseInt(orientation));
                                        payload.putBoolean((String) "canDelete", false);

                                        // This works, but is emitDeviceEvent safe here?
                                        emitDeviceEvent("newLocalPhoto", payload);
                                    } catch (Exception e) {
                                        //
                                    }
                                } while (cursor.moveToNext());
                            }
                            cursor.close();
                        }
                    }
                    Thread t = new Thread(new PhotoLookup(minEpoch));
                    t.start();

                    // Close the promise, results handled as events
                    promise.resolve(null);
                }
                catch (Exception e) {
                    promise.reject("START ERROR", e);
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
