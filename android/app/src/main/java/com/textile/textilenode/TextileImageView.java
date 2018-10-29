package com.textile.textilenode;

import android.support.v7.widget.AppCompatImageView;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * TextileImageView is a top-level node for TextileImage. It can display images
 * from a Textile node by specifying a source hash path.
 */
class TextileImageView extends AppCompatImageView {

    private ThemedReactContext context;
    private String imageId;
    private int forMinWidth;
    private ScaleType scaleType;
    private boolean needsRenderScaleType = false;
    private boolean needsRenderImage = false;

    public TextileImageView(ThemedReactContext context) {
        super(context);
        this.context = context;
    }

    public void setImageId(String imageId) {
        if (this.imageId != imageId) {
            this.imageId = imageId;
            this.needsRenderImage = true;
        }
    }

    public void setForMinWidth(int forMinWidth) {
        if (this.forMinWidth != forMinWidth) {
            this.forMinWidth = forMinWidth;
            this.needsRenderImage = true;
        }
    }

    public void setScaleType(ScaleType scaleType) {
        if (this.scaleType != scaleType) {
            this.scaleType = scaleType;
            this.needsRenderScaleType = true;
        }
    }

    public void render() {
        if (this.needsRenderScaleType) {
            super.setScaleType(this.scaleType);
            this.needsRenderScaleType = false;
        }
        if (this.needsRenderImage) {
            ReactContext reactContext = (ReactContext)getContext();
            RCTEventEmitter eventEmitter = reactContext.getJSModule(RCTEventEmitter.class);
            new TextileImageTask(getId(), eventEmitter, this.imageId, this.forMinWidth, this).execute();
            this.needsRenderImage = false;
        }
    }
}

