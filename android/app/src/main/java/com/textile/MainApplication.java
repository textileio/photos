package com.textile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.wix.reactnativenotifications.RNNotificationsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.horcrux.svg.SvgPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
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
            new RNNotificationsPackage(),
        new UploaderReactPackage(),
        new ImagePickerPackage(),
        new RNBackgroundFetchPackage(),
        new RNDeviceInfo(),
        new ReactNativeConfigPackage(),
        new BackgroundTimerPackage(),
        new BackgroundTaskPackage(),
        new SvgPackage(),
        new RNFSPackage(),
        new ReactNativeI18n(),
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
