package com.textile.textilenode;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.util.Base64;
import android.widget.ImageView;

public class TextileImageTask extends AsyncTask<Void, Void, Bitmap> {

    String imageId;
    String path;
    ImageView imageView;

    public TextileImageTask(String imageId, String path, ImageView imageView) {
        this.imageId = imageId;
        this.path = path;
        this.imageView = imageView;
    }

    protected Bitmap doInBackground(Void... params) {
        try {
            String base64String = TextileNode.node.getFileData(this.imageId, this.path);
            byte[] decodedString = Base64.decode(base64String, Base64.DEFAULT);
            Bitmap bitmap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
            return bitmap;
        } catch (Exception e) {
            return Bitmap.createBitmap(0, 0, Bitmap.Config.ARGB_8888);
        }
    }

    protected void onPostExecute(Bitmap result) {
        this.imageView.setImageBitmap(result);
    }
}
