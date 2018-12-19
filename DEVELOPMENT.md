# Insteall Textile Mobile

To run Textile Mobile in development mode you'll need,

1. The latest code from this repo + dependencies
2. The [textile-go](https://github.com/textileio/textile-g) framework to run a cafe node

## Latest Textile Mobile

`git clone git@github.com:textileio/textile-mobile.git`

## Textile Cafe

You can identify the correct cafe version you'll need by inspecting the `/package.json` file to see the `@textile/go-mobile` version number.

You can either clone/checkout the appropriate commit associated with that release or download the release built for your hardware. You can find the release here, [textile-go releases](https://github.com/textileio/textile-go/releases)

### Start your daemon

If you are running the Textile command line for the first time, use this [Quick Start](https://github.com/textileio/textile-go/wiki/Quick-Start) guide.

### Run a Cafe

Now that you've started your daemon, modify it to run in Cafe mode and restart it. [See here for instructions](https://github.com/textileio/textile-go/wiki/Run-Cafe)

At the same time, you can capture your API and Cafe addresses from the textile config file. They should look like,

```
    "Addresses": {
        "API": "127.0.0.1:40600",
        "CafeAPI": "127.0.0.1:40601",
        "Gateway": "127.0.0.1:5050"
    },
```

You'll need these to modify your `.env` to run the mobile app in development mode.

## Run app in development mode

1. Install all dependancies with `yarn`
2. Launch your Textile cafe (see above)
3. Modify your `.env` file to match your cafe details (see below)
4. Finally, run `react-native start` and launch the app in the simulator of your choice. You can luaunch the app using one of hte IDEs or directly using `react-native run-ios` or `react-native run-android`

### Creating your .env file

You should store a file called, `.env` in the root of your Textile Mobile folder. It should look like,

```
RN_TEXTILE_CAFES="{cafe-peerid}"
RN_TEXTILE_CAFE_GATEWAY_URL="http://{gateway-address}"
RN_TEXTILE_CAFE_API_PREFIX="http://"
RN_TEXTILE_CAFE_API_PIN_PATH="/cafe/v0/pin"
RN_TEXTILE_CAMERA_ROLL_THREAD_KEY="photos-camera_roll"
RN_TEMPORARY_REFERRAL="SOMETHING"
RN_URL_SCHEME="textile-dev"
```

You can find the values for `cafe-peerid` in the Quick Start step above and the `gateway-address` (including port) should be found in the Cafe setup step above.
