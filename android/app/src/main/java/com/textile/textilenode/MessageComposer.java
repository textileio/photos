package com.textile.textilenode;

import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class MessageComposer extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "MessageComposer";
    private static ReactApplicationContext reactContext = null;

    public MessageComposer(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void composeMessage(String number, String message) {
        Intent intent = new Intent(Intent.ACTION_SENDTO);
        intent.setData(Uri.parse("smsto:" + number));
        intent.putExtra("sms_body", message);
        PackageManager pm = this.reactContext.getPackageManager();
        ComponentName cn = intent.resolveActivity(pm);
        if (cn != null) {
            this.reactContext.startActivity(intent);
        }

    }
}
