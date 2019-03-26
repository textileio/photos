package com.textile;

import android.app.Application;

import com.apsl.versionnumber.RNVersionNumberPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.imagepicker.ImagePickerPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.rnfs.RNFSPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.smixx.fabric.FabricPackage;
import com.crashlytics.android.Crashlytics;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.textile.textilenode.TextilePackage;
import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;
import com.vydia.RNUploader.UploaderReactPackage;

import io.fabric.sdk.android.Fabric;
import io.textile.rnmobile.RNTextilePackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new RNGestureHandlerPackage(),
              new RNScreensPackage(),
              new ReactNativeContacts(),
              new RNVersionNumberPackage(),
              new ImagePickerPackage(),
              new RNFSPackage(),
              new RNBackgroundFetchPackage(),
              new BackgroundTimerPackage(),
              new UploaderReactPackage(),
              new FabricPackage(),
              new ReactNativeConfigPackage(),
              new ReactNativePushNotificationPackage(),
              new RNTextilePackage(),
              new TextilePackage(),
              new MainReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    Fabric.with(this, new Crashlytics());
  }
}
