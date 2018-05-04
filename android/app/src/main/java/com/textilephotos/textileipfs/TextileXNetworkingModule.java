package com.textilephotos.textileipfs;

import android.util.Log;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.network.ReactCookieJarContainer;

import java.lang.reflect.Field;
import java.security.cert.CertificateException;
import java.util.Collection;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import okhttp3.OkHttpClient;

public class TextileXNetworkingModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext mApplicationContext;
    public TextileXNetworkingModule(ReactApplicationContext context) {
        super(context);
        mApplicationContext = context;
    }
    @Override
    public String getName() {
        return "TextileNetworkingModule";
    }

    private OkHttpClient getClientForModule(NativeModule module)
            throws Exception {
        Field f = module.getClass().getDeclaredField("mClient");
        f.setAccessible(true);
        return (OkHttpClient)f.get(module);
    }

    private void setClientForModule(
            NativeModule module, OkHttpClient client)
            throws Exception {
        Field f = module.getClass().getDeclaredField("mClient");
        f.setAccessible(true);
        f.set(module, client);
    }

    private NativeModule getNetworkingModule() {
        Collection<NativeModule> modules =
                mApplicationContext.getCatalystInstance().getNativeModules();
        for (NativeModule module : modules) {
            if ("Networking".equals(module.getName())) {
                return module;
            }
        }
        return null;
    }


    @Override
    public void initialize() {
        try {


            NativeModule module = getNetworkingModule();
            OkHttpClient client = getClientForModule(module);

            // Create a trust manager that does not validate certificate chains
            final TrustManager[] trustAllCerts = new TrustManager[] {
                    new X509TrustManager() {
                        @Override
                        public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType) throws CertificateException {
                        }

                        @Override
                        public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType) throws CertificateException {
                        }

                        @Override
                        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                            return new java.security.cert.X509Certificate[]{};
                        }
                    }
            };


            HostnameVerifier hostnameVerifier = org.apache.http.conn.ssl.SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER;

//            DefaultHttpClient client = new DefaultHttpClient();
//
//            SchemeRegistry registry = new SchemeRegistry();
//            SSLSocketFactory socketFactory = SSLSocketFactory.getSocketFactory();
//            socketFactory.setHostnameVerifier((X509HostnameVerifier) hostnameVerifier);
//            registry.register(new Scheme("https", socketFactory, 443));
//            SingleClientConnManager mgr = new SingleClientConnManager(client.getParams(), registry);
//            DefaultHttpClient httpClient = new DefaultHttpClient(mgr, client.getParams());

// Set verifier
            HttpsURLConnection.setDefaultHostnameVerifier(hostnameVerifier);



            // Install the all-trusting trust manager
            final SSLContext sslContext = SSLContext.getInstance("SSL");
            sslContext.init(null, trustAllCerts, new java.security.SecureRandom());
            // Create an ssl socket factory with our all-trusting manager
            final SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();

            OkHttpClient.Builder builder = client.newBuilder();
            builder.sslSocketFactory(sslSocketFactory, (X509TrustManager)trustAllCerts[0]);
            builder.hostnameVerifier(new HostnameVerifier() {
                        @Override
                        public boolean verify(String hostname, SSLSession session) {
//                            boolean result = hostname.equals("127.0.0.1");
                            return true;
                        }
                    });
            builder.cookieJar(new ReactCookieJarContainer());
            OkHttpClient okHttpClient = builder
                    .connectTimeout(15, TimeUnit.SECONDS)
                    .writeTimeout(15, TimeUnit.SECONDS)
                    .readTimeout(15, TimeUnit.SECONDS)
                    .build();

            setClientForModule(module, okHttpClient);
        } catch (Exception ex) {
            android.util.Log.e("RG", "Error while patching networking module.", ex);
        }
    }
}
