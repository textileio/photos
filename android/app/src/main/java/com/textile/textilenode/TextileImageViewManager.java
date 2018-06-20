package com.textile.textilenode;

import android.content.Context;
import android.widget.ImageView;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public final class TextileImageViewManager extends SimpleViewManager<TextileImageView> {

    static final String REACT_CLASS = "TextileImageView";

    private Context context;

    public TextileImageViewManager(ReactApplicationContext context) {
        this.context = context;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public TextileImageView createViewInstance(ThemedReactContext context) {
        return new TextileImageView(context);
    }

    @ReactProp(name = "hashPath")
    public void setHashPath(TextileImageView textileImageView, String hashPath) {
        textileImageView.setHashPath(hashPath);
    }

    @ReactProp(name = "resizeMode")
    public void setResizeMode(TextileImageView textileImageView, String resizeMode) {
        ImageView.ScaleType scaleType;
        switch (resizeMode) {
            case "cover":
                scaleType = ImageView.ScaleType.CENTER_CROP;
            case "contain":
                scaleType = ImageView.ScaleType.CENTER_INSIDE;
            case "stretch":
                scaleType = ImageView.ScaleType.FIT_XY;
            case "center":
                scaleType = ImageView.ScaleType.CENTER;
            default:
                scaleType = ImageView.ScaleType.CENTER;
        }
        textileImageView.xsetScaleType(scaleType);
    }

    @Override
    protected void onAfterUpdateTransaction(TextileImageView view) {
        super.onAfterUpdateTransaction(view);
        view.render();
    }
}

