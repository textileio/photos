package com.textile.textilenode;

import android.content.Context;
import android.widget.ImageView;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

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

    @ReactProp(name = "imageId")
    public void setImageId(TextileImageView textileImageView, String imageId) {
        textileImageView.setImageId(imageId);
    }

    @ReactProp(name = "forMinWidth")
    public void setMinWdth(TextileImageView textileImageView, int forMinWidth) {
        textileImageView.setForMinWidth(forMinWidth);
    }

    @ReactProp(name = "resizeMode")
    public void setResizeMode(TextileImageView textileImageView, String resizeMode) {
        ImageView.ScaleType scaleType;
        switch (resizeMode) {
            case "cover":
                scaleType = ImageView.ScaleType.CENTER_CROP;
                break;
            case "contain":
                scaleType = ImageView.ScaleType.CENTER_INSIDE;
                break;
            case "stretch":
                scaleType = ImageView.ScaleType.FIT_XY;
                break;
            case "center":
                scaleType = ImageView.ScaleType.CENTER;
                break;
            default:
                scaleType = ImageView.ScaleType.CENTER;
        }
        textileImageView.setScaleType(scaleType);
    }

    @Override
    public @Nullable Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
                "onLoad",
                MapBuilder.of("registrationName", "onLoad"),
                "onError",
                MapBuilder.of("registrationName", "onError")
        );
    }

    @Override
    protected void onAfterUpdateTransaction(TextileImageView view) {
        super.onAfterUpdateTransaction(view);
        view.render();
    }
}

