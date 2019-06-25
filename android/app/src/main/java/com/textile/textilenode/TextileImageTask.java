package com.textile.textilenode;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.util.Base64;
import android.widget.ImageView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.concurrent.CompletableFuture;

import io.textile.textile.Handlers;
import io.textile.textile.Textile;

public class TextileImageTask extends AsyncTask<Void, Void, Bitmap> {

    private int viewId;
    private RCTEventEmitter eventEmitter;
    private String target;
    private boolean ipfs;
    private int index;
    private int forMinWidth;
    private ImageView imageView;
    private Exception e;

    public TextileImageTask(int viewId, RCTEventEmitter eventEmitter, String target, boolean ipfs, int index, int forMinWidth, ImageView imageView) {
        this.viewId = viewId;
        this.eventEmitter = eventEmitter;
        this.target = target;
        this.ipfs = ipfs;
        this.index = index;
        this.forMinWidth = forMinWidth;
        this.imageView = imageView;
    }

    protected Bitmap doInBackground(Void... params) {
        try {
            final CompletableFuture<byte[]> futureData = new CompletableFuture<>();
            final Handlers.DataHandler handler = new Handlers.DataHandler() {
                @Override
                public void onComplete(final byte[] data, final String media) {
                    futureData.complete(data);
                }

                @Override
                public void onError(final Exception e) {
                    futureData.completeExceptionally(e);
                }
            };
            if (this.ipfs) {
                Textile.instance().ipfs.dataAtPath(this.target, handler);
            } else {
                final String path = String.format("%s/%d", this.target, this.index);
                Textile.instance().files.imageContentForMinWidth(path, this.forMinWidth, handler);
            }
            final byte[] data = futureData.join();
            return BitmapFactory.decodeByteArray(data, 0, data.length);
        } catch (Exception e) {
            this.e = e;
            return Bitmap.createBitmap(10, 10, Bitmap.Config.ARGB_8888);
        }
    }

    protected void onPostExecute(Bitmap result) {
        this.imageView.setImageBitmap(result);
        WritableMap event = Arguments.createMap();
        if (this.e == null) {
            this.eventEmitter.receiveEvent(this.viewId, "onLoad", event);
        } else {
            event.putString("message", this.e.getLocalizedMessage());
            this.eventEmitter.receiveEvent(this.viewId, "onError", event);
        }
    }
}
