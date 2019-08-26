package com.textile.textilenode;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.AdvertiseCallback;
import android.bluetooth.le.AdvertiseData;
import android.bluetooth.le.AdvertiseSettings;
import android.bluetooth.le.AdvertisingSet;
import android.bluetooth.le.AdvertisingSetCallback;
import android.bluetooth.le.AdvertisingSetParameters;
import android.bluetooth.le.BluetoothLeAdvertiser;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.ParcelUuid;
import android.support.annotation.RequiresApi;
import android.telecom.Call;
import android.util.Log;
import android.widget.Toast;

import com.textile.MainActivity;

import java.util.concurrent.TimeUnit;

/**
 * Manages BLE Advertising independent of the main app.
 * If the app goes off screen (or gets killed completely) advertising can continue because this
 * Service is maintaining the necessary Callback in memory.
 */
public class AdvertiserService extends Service {

	private static final String TAG = "ABC"; //AdvertiserService.class.getSimpleName();

	private static final int FOREGROUND_NOTIFICATION_ID = 1;

	/**
	 * A global variable to let AdvertiserFragment check if the Service is running without needing
	 * to start or bind to it.
	 * This is the best practice method as defined here:
	 * https://groups.google.com/forum/#!topic/android-developers/jEvXMWgbgzE
	 */
	public static boolean running = false;

	public static final String ADVERTISING_FAILED =
			"com.example.android.bluetoothadvertisements.advertising_failed";

	public static final String ADVERTISING_FAILED_EXTRA_CODE = "failureCode";

	public static final int ADVERTISING_TIMED_OUT = 6;

	private BluetoothLeAdvertiser mBluetoothLeAdvertiser;

	private AdvertiseCallback mAdvertiseCallback;

	private Handler mHandler;

	private Runnable timeoutRunnable;

	/**
	 * Length of time to allow advertising before automatically shutting off. (10 minutes)
	 */
	private long TIMEOUT = TimeUnit.MILLISECONDS.convert(10, TimeUnit.MINUTES);

	public AdvertiserService() {
		super();
		Log.d(TAG, "Service: this happened");
	}

	@Override
	public void onCreate() {
		Log.d(TAG, "Service: onCreate");
		running = true;
		initialize();
		startAdvertising();
		setTimeout();
		Log.e("ABC", "should be");
		super.onCreate();
	}

	@Override
	public void onDestroy() {
		/**
		 * Note that onDestroy is not guaranteed to be called quickly or at all. Services exist at
		 * the whim of the system, and onDestroy can be delayed or skipped entirely if memory need
		 * is critical.
		 */
		running = false;
		stopAdvertising();
		mHandler.removeCallbacks(timeoutRunnable);
		stopForeground(true);
		super.onDestroy();
	}

	/**
	 * Required for extending service, but this will be a Started Service only, so no need for
	 * binding.
	 */
	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}

	/**
	 * Get references to system Bluetooth objects if we don't have them already.
	 */
	private void initialize() {
		Log.d(TAG,"init advertiser");
		if (mBluetoothLeAdvertiser == null) {
			Log.d(TAG,"init2 ");
			BluetoothManager mBluetoothManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
			if (mBluetoothManager != null) {
				Log.d(TAG,"init 3");
				BluetoothAdapter mBluetoothAdapter = mBluetoothManager.getAdapter();
				if (mBluetoothAdapter != null) {
					Log.d(TAG,"init 4");
					mBluetoothLeAdvertiser = mBluetoothAdapter.getBluetoothLeAdvertiser();
				} else {
					Log.e("ABC", "R.string.bt_null 1");
				}
			} else {
				Log.e("ABC", "R.string.bt_null 2");
			}
		}

	}

	/**
	 * Starts a delayed Runnable that will cause the BLE Advertising to timeout and stop after a
	 * set amount of time.
	 */
	private void setTimeout(){
		mHandler = new Handler();
		timeoutRunnable = new Runnable() {
			@Override
			public void run() {
				Log.d(TAG, "AdvertiserService has reached timeout of "+TIMEOUT+" milliseconds, stopping advertising.");
				sendFailureIntent(ADVERTISING_TIMED_OUT);
				stopSelf();
			}
		};
		mHandler.postDelayed(timeoutRunnable, TIMEOUT);
	}

	/**
	 * Starts BLE Advertising.
	 */
	private void startAdvertising() {
		goForeground();

		Log.d(TAG, "Service: Starting Advertising");

		if (mAdvertiseCallback == null) {
			AdvertiseSettings settings = buildAdvertiseSettings();
			AdvertiseData data = buildAdvertiseData();
			AdvertiseData scanResponse = buildScanResponse();
			AdvertisingSetParameters params = buildParameters();
			mAdvertiseCallback = new SampleAdvertiseCallback();

			if (mBluetoothLeAdvertiser != null) {
				// Check if BLE 5
//				mBluetoothLeAdvertiser.startAdvertisingSet(params, data, null, null, null,
//						buildCallback());

				//else
				mBluetoothLeAdvertiser.startAdvertising(settings, data,
						mAdvertiseCallback);
			}
		}
	}

	/**
	 * Move service to the foreground, to avoid execution limits on background processes.
	 *
	 * Callers should call stopForeground(true) when background work is complete.
	 */
	private void goForeground() {
		Log.d(TAG, "goForeground");
//        val channelId =
		Intent notificationIntent = new Intent(this, MainActivity.class);
		PendingIntent pendingIntent = PendingIntent.getActivity(this, 0,
				notificationIntent, 0);

		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
			String NOTIFICATION_CHANNEL_ID = "com.textile.Wallet";
			String channelName = "My Background Service";
			NotificationChannel chan = new NotificationChannel(NOTIFICATION_CHANNEL_ID, channelName, NotificationManager.IMPORTANCE_NONE);
			chan.setLightColor(Color.BLUE);
			chan.setLockscreenVisibility(Notification.VISIBILITY_PRIVATE);
			NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
			assert manager != null;
			manager.createNotificationChannel(chan);

			Notification n = new Notification.Builder(this, NOTIFICATION_CHANNEL_ID)
					.setContentTitle("Advertising device via Bluetooth")
					.setContentText("This device is discoverable to others nearby.")
//					.setSmallIcon(R.drawable.ic_launcher)
					.setContentIntent(pendingIntent)
					.build();
			startForeground(FOREGROUND_NOTIFICATION_ID, n);
		} else {
			Notification n = new Notification.Builder(this)
					.setContentTitle("Advertising device via Bluetooth")
					.setContentText("This device is discoverable to others nearby.")
//					.setSmallIcon(R.drawable.ic_launcher)
					.setContentIntent(pendingIntent)
					.build();
			startForeground(FOREGROUND_NOTIFICATION_ID, n);
		}
	}

	/**
	 * Stops BLE Advertising.
	 */
	private void stopAdvertising() {
		Log.d(TAG, "Service: Stopping Advertising");
		if (mBluetoothLeAdvertiser != null) {
			mBluetoothLeAdvertiser.stopAdvertising(mAdvertiseCallback);
			mAdvertiseCallback = null;
		}
	}

	private AdvertisingSetCallback buildCallback() {
		return new AdvertisingSetCallback() {
		@Override
		public void onAdvertisingSetStarted(AdvertisingSet advertisingSet, int txPower, int status) {
			Log.i("ABC", "onAdvertisingSetStarted(): txPower:" + txPower + " , status: "
				+ status);
		//                currentAdvertisingSet = advertisingSet;
		}

		@Override
		public void onAdvertisingSetStopped(AdvertisingSet advertisingSet) {
			Log.i("ABC", "onAdvertisingSetStopped():");
			}
		};
	}

	private AdvertiseData buildScanResponse() {
		AdvertiseData.Builder dataBuilder = new AdvertiseData.Builder();
		ParcelUuid Service_UUID = ParcelUuid
				.fromString("0000b82d-0000-1000-8000-00805f8b34fb");
		dataBuilder.addServiceUuid(Service_UUID);
		dataBuilder.addServiceData(Service_UUID, "Hello".getBytes());
		return dataBuilder.build();

	}
	/**
	 * Returns an AdvertiseData object which includes the Service UUID and Device Name.
	 */
	private AdvertiseData buildAdvertiseData() {

		/**
		 * Note: There is a strict limit of 31 Bytes on packets sent over BLE Advertisements.
		 *  This includes everything put into AdvertiseData including UUIDs, device info, &
		 *  arbitrary service or manufacturer data.
		 *  Attempting to send packets over this limit will result in a failure with error code
		 *  AdvertiseCallback.ADVERTISE_FAILED_DATA_TOO_LARGE. Catch this error in the
		 *  onStartFailure() method of an AdvertiseCallback implementation.
		 */

		AdvertiseData.Builder dataBuilder = new AdvertiseData.Builder();
		ParcelUuid Service_UUID = ParcelUuid
				.fromString("0000b82d-0000-1000-8000-00805f8b34fb");
		dataBuilder.addServiceUuid(Service_UUID);
//		dataBuilder.addServiceData(Service_UUID, "Hello".getBytes());
		dataBuilder.setIncludeDeviceName(true);

		/* For example - this will cause advertising to fail (exceeds size limit) */
		//String failureData = "asdghkajsghalkxcjhfa;sghtalksjcfhalskfjhasldkjfhdskf";
		//dataBuilder.addServiceData(Constants.Service_UUID, failureData.getBytes());

		return dataBuilder.build();
	}

	/**
	 * Returns an AdvertiseSettings object set to use low power (to help preserve battery life)
	 * and disable the built-in timeout since this code uses its own timeout runnable.
	 */
	private AdvertiseSettings buildAdvertiseSettings() {
		AdvertiseSettings.Builder settingsBuilder = new AdvertiseSettings.Builder();
		settingsBuilder.setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_POWER);
		settingsBuilder.setTimeout(0);
		settingsBuilder.setConnectable(false);
		return settingsBuilder.build();
	}

	private AdvertisingSetParameters buildParameters() {
		AdvertisingSetParameters.Builder parameters = (new AdvertisingSetParameters.Builder())
                .setLegacyMode(false)
				// setConnectable once it's working without scanning. I believe we'll need same service UUID
                .setScannable(true)
				.setAnonymous(false)
                .setInterval(AdvertisingSetParameters.INTERVAL_LOW)
                .setTxPowerLevel(AdvertisingSetParameters.TX_POWER_MEDIUM)
                .setPrimaryPhy(BluetoothDevice.PHY_LE_1M)
                .setSecondaryPhy(BluetoothDevice.PHY_LE_1M);
		return parameters.build();
	}

	/**
	 * Custom callback after Advertising succeeds or fails to start. Broadcasts the error code
	 * in an Intent to be picked up by AdvertiserFragment and stops this Service.
	 */
	private class SampleAdvertiseCallback extends AdvertiseCallback {

		@Override
		public void onStartFailure(int errorCode) {
			super.onStartFailure(errorCode);

			Log.d(TAG, "Advertising failed");
			sendFailureIntent(errorCode);
			stopSelf();

		}

		@Override
		public void onStartSuccess(AdvertiseSettings settingsInEffect) {
			super.onStartSuccess(settingsInEffect);
			Log.d(TAG, "Advertising successfully started");
		}
	}

	/**
	 * Builds and sends a broadcast intent indicating Advertising has failed. Includes the error
	 * code as an extra. This is intended to be picked up by the {@code AdvertiserFragment}.
	 */
	private void sendFailureIntent(int errorCode){
		Intent failureIntent = new Intent();
		failureIntent.setAction(ADVERTISING_FAILED);
		failureIntent.putExtra(ADVERTISING_FAILED_EXTRA_CODE, errorCode);
		sendBroadcast(failureIntent);
	}

}
