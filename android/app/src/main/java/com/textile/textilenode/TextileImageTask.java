package com.textile.textilenode;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.util.Base64;
import android.widget.ImageView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import org.json.JSONObject;

public class TextileImageTask extends AsyncTask<Void, Void, Bitmap> {

    private int viewId;
    private RCTEventEmitter eventEmitter;
    private String imageId;
    private int forMinWidth;
    private ImageView imageView;
    private Exception e;

    public TextileImageTask(int viewId, RCTEventEmitter eventEmitter, String imageId, int forMinWidth, ImageView imageView) {
        this.viewId = viewId;
        this.eventEmitter = eventEmitter;
        this.imageId = imageId;
        this.forMinWidth = forMinWidth;
        this.imageView = imageView;
    }

    protected Bitmap doInBackground(Void... params) {
        try {
            JSONObject imageJson = new JSONObject(TextileNode.node.getPhotoDataForMinWidth(this.imageId, this.forMinWidth));
            String dataUrl = imageJson.getString("url");
            String encodingPrefix = "base64,";
            int contentStartIndex = dataUrl.indexOf(encodingPrefix) + encodingPrefix.length();
            byte[] decodedString = Base64.decode(dataUrl.substring(contentStartIndex), Base64.DEFAULT);
            Bitmap bitmap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
            return bitmap;
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
