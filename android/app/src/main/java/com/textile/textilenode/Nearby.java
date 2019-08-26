package com.textile.textilenode;

import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.AdvertiseCallback;
import android.bluetooth.le.AdvertiseData;
import android.bluetooth.le.AdvertisingSet;
import android.bluetooth.le.AdvertisingSetCallback;
import android.bluetooth.le.AdvertisingSetParameters;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.le.BluetoothLeAdvertiser;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.ParcelUuid;
import android.util.Log;
import android.widget.Toast;

import org.json.JSONObject;

public class Nearby extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "Nearby";
    private static ReactApplicationContext reactContext = null;
    public static Error error;
    public static Boolean enabled = false;
    public static Boolean advertising = false;

    private BluetoothAdapter mBluetoothAdapter;
    public static final int REQUEST_ENABLE_BT = 1;
    public static final ParcelUuid Service_UUID = ParcelUuid
            .fromString("0000b81d-0000-1000-8000-00805f9b34fb");
//    public static BluetoothAdapter adapter;
    public static BluetoothManager manager;
    public static BroadcastReceiver advertisingFailureReceiver;
    public static AdvertiserService service;
//    private static BluetoothLeAdvertiser advertiser;
//    public static AdvertisingSetParameters parameters;
//    public static AdvertiseData data;
//    private int maxDataLength;


    private Executor executor = Executors.newSingleThreadExecutor();

    public Nearby(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        manager = (BluetoothManager) reactContext
                .getSystemService(reactContext.BLUETOOTH_SERVICE);
        mBluetoothAdapter = manager.getAdapter();
    }

    public void setupCallbacks() {
        advertisingFailureReceiver = new BroadcastReceiver() {

            /**
             * Receives Advertising error codes from {@code AdvertiserService} and displays error messages
             * to the user. Sets the advertising toggle to 'false.'
             */
            @Override
            public void onReceive(Context context, Intent intent) {

                int errorCode = intent.getIntExtra(AdvertiserService.ADVERTISING_FAILED_EXTRA_CODE, -1);

                String errorMessage = "start_error_prefix";
                switch (errorCode) {
                    case AdvertiseCallback.ADVERTISE_FAILED_ALREADY_STARTED:
                        errorMessage += "start_error_already_started";
                        break;
                    case AdvertiseCallback.ADVERTISE_FAILED_DATA_TOO_LARGE:
                        errorMessage += " start_error_too_large";
                        break;
                    case AdvertiseCallback.ADVERTISE_FAILED_FEATURE_UNSUPPORTED:
                        errorMessage += " start_error_unsupported";
                        break;
                    case AdvertiseCallback.ADVERTISE_FAILED_INTERNAL_ERROR:
                        errorMessage += " start_error_internal";
                        break;
                    case AdvertiseCallback.ADVERTISE_FAILED_TOO_MANY_ADVERTISERS:
                        errorMessage += " start_error_too_many";
                        break;
                    case AdvertiserService.ADVERTISING_TIMED_OUT:
                        errorMessage = " advertising_timedout";
                        break;
                    default:
                        errorMessage += " start_error_unknown";
                }

                Log.d("ABC", errorMessage);
            }
        };
    }
    public void setup() {
                //getSystemService(reactContext.BLUETOOTH_SERVICE))
//                .getAdapter();

        // Is Bluetooth supported on this device?
        if (mBluetoothAdapter != null) {

            // Is Bluetooth turned on?
            if (mBluetoothAdapter.isEnabled()) {

                // Are Bluetooth Advertisements supported on this device?
                if (mBluetoothAdapter.isMultipleAdvertisementSupported()) {

                    // Everything is supported and enabled, load the fragments.
                    Log.e("ABC", "isMultipleAdvertisementSupported are supported!");
                    setupCallbacks();

                } else {

                    // Bluetooth Advertisements are not supported.
                    Log.e("ABC", "isMultipleAdvertisementSupported not supported!");
                }
            } else {

                // Prompt user to turn on Bluetooth (logic continues in onActivityResult()).
                Log.e("ABC", "supported!");
                enabled = true;
//                startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
            }
        } else {

            // Bluetooth is not supported.
            Log.e("ABC", "mBluetoothAdapter is null!");
        }
        Log.e("ABC", "done setup!");
    }
//    public void setupB() {
//        this.manager = (BluetoothManager) reactContext.getSystemService(reactContext.BLUETOOTH_SERVICE);
//        this.adapter = this.manager.getAdapter();
//        if (this.adapter == null || !this.adapter.isEnabled()) {
//            Log.e("ABC", "not enabled!");
//            this.enabled = false;
//            return;
//        } else if (!adapter.isLe2MPhySupported()) {
//            Log.e("ABC", "2M PHY not supported!");
//            this.enabled = false;
//            return;
//        } else if (!adapter.isLeExtendedAdvertisingSupported()) {
//            Log.e("ABC", "LE Extended Advertising not supported!");
//            this.enabled = false;
//            return;
//        }
//
//        try {
//            this.advertiser = adapter.getBluetoothLeAdvertiser();
//            this.maxDataLength = adapter.getLeMaximumAdvertisingDataLength();
//            Log.e("ABC", "supported!");
//            this.enabled = true;
//        } catch (Error error) {
//            Log.e("ABC", "error!");
//            this.error = error;
//            this.enabled = false;
//        }
//    }

    public void advertise() {


    }

    /**
     * Starts BLE Advertising by starting {@code AdvertiserService}.
     */
    private void startAdvertising() {
//        Context c = getActivity();
        Log.e("ABC", "intent");
        reactContext.startService(getServiceIntent(reactContext));
        Log.e("ABC", "new true");
//        c.startService(getServiceIntent(c));
//        service = new AdvertiserService();
//        service.onCreate();
        advertising = true;
    }

    /**
     * Stops BLE Advertising by stopping {@code AdvertiserService}.
     */
    private void stopAdvertising() {
//        service = null;
//        service.onDestroy();
        reactContext.stopService(getServiceIntent(null));
        advertising = false;
    }

    private static Intent getServiceIntent(Context c) {
        return new Intent(c, AdvertiserService.class);
    }

    @ReactMethod
    public void start(String uuid) {
        Log.e("ABC", "build!");
        Log.e("ABC", advertising ? "advertising" : "not advertising");
        if (!advertising) {
            UUID _uuid = UUID.fromString(uuid);

            Log.e("ABC", "setup!");
            setup();

            Log.e("ABC", "advertise!");
//            Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            startAdvertising();
        } else {
//            stopAdvertising();
        }

//        UUID[] uuids = new UUID[_uuid];


//        AdvertisingSetParameters.Builder parameters = (new AdvertisingSetParameters.Builder())
//                .setLegacyMode(false)
//                .setScannable(true)
//                .setInterval(AdvertisingSetParameters.INTERVAL_LOW)
//                .setTxPowerLevel(AdvertisingSetParameters.TX_POWER_MEDIUM)
//                .setPrimaryPhy(BluetoothDevice.PHY_LE_1M)
//                .setSecondaryPhy(BluetoothDevice.PHY_LE_2M);
//
//        AdvertiseData data = (new AdvertiseData.Builder()).addServiceData(new
//                        ParcelUuid(_uuid),
//                "You should be able to fit large amounts of data up to maxDataLength. This goes  up to 1650 bytes. For legacy advertising this would not work".getBytes()).build();
//
//        AdvertisingSetCallback callback = new AdvertisingSetCallback() {
//            @Override
//            public void onAdvertisingSetStarted(AdvertisingSet advertisingSet, int txPower, int status) {
//                Log.i("ABC", "onAdvertisingSetStarted(): txPower:" + txPower + " , status: "
//                        + status);
////                currentAdvertisingSet = advertisingSet;
//            }
//
//            @Override
//            public void onAdvertisingSetStopped(AdvertisingSet advertisingSet) {
//                Log.i("ABC", "onAdvertisingSetStopped():");
//            }
//        };
//
//        Log.e("ABC", "start!");
//        this.advertiser.startAdvertisingSet(parameters.build(), data, null, null, null, callback);
    }


    @Override
    public String getName() {
        return REACT_CLASS;
    }

    // Android specific method for turning photo URI into path + ext
    @ReactMethod
    public void init(final String name, final String address, final String avatar, final Promise promise) {
        this.start("0000b81d-0000-1000-8000-00805f8b34fb");
        promise.resolve(true);
    }
}
