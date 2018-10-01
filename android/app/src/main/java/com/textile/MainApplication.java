package com.textile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.imagepicker.ImagePickerPackage;
import com.jamesisaac.rnbackgroundtask.BackgroundTaskPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.rnfs.RNFSPackage;
import com.smixx.fabric.FabricPackage;
import com.textile.textilenode.TextileNodePackage;
import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;
import com.vydia.RNUploader.UploaderReactPackage;
import com.apsl.versionnumber.RNVersionNumberPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new FabricPackage(),
        new MainReactPackage(),
        new RNVersionNumberPackage(),
        new ReactNativePushNotificationPackage(),
        new UploaderReactPackage(),
        new ImagePickerPackage(),
        new RNBackgroundFetchPackage(),
        new RNDeviceInfo(),
        new ReactNativeConfigPackage(),
        new BackgroundTimerPackage(),
        new BackgroundTaskPackage(),
        new RNFSPackage(),
        new VectorIconsPackage(),
        new TextileNodePackage()
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
    BackgroundTaskPackage.useContext(this);
  }
}
