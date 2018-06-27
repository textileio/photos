package com.textile.textilenode;

import android.support.v7.widget.AppCompatImageView;

import com.facebook.react.uimanager.ThemedReactContext;

/**
 * TextileImageView is a top-level node for TextileImage. It can display images
 * from a Textile node by specifying a source hash path.
 */
class TextileImageView extends AppCompatImageView {

    private ThemedReactContext context;
    private String imageId;
    private String path;
    private ScaleType scaleType;

    public TextileImageView(ThemedReactContext context) {
        super(context);
        this.context = context;
    }

    public void setImageId(String imageId) {
        this.imageId = imageId;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public void setScaleType(ScaleType scaleType) {
        this.scaleType = scaleType;
    }

    public void render() {
        try {
            super.setScaleType(this.scaleType);
            new TextileImageTask(this.imageId, this.path, this).execute();
        } catch (Exception e) {
            //
        }
    }
}

