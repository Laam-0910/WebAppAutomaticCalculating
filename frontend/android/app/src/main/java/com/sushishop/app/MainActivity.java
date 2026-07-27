package com.sushishop.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioManager;
import android.os.Build;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.util.Log;
import com.getcapacitor.BridgeActivity;
import java.util.Locale;

public class MainActivity extends BridgeActivity implements TextToSpeech.OnInitListener {
    private static final String TAG = "MainActivity";
    private static MainActivity instance;
    private TextToSpeech tts;
    private boolean isTtsReady = false;

    public static void closeQRDirectly() {
        if (instance != null) {
            instance.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        if (instance.getBridge() != null && instance.getBridge().getWebView() != null) {
                            String js = "(function(){ try { if(window.closeQROrder) { window.closeQROrder(); } window.dispatchEvent(new CustomEvent('bank_payment_received', { detail: { amount: 1 } })); } catch(e){} })();";
                            instance.getBridge().getWebView().evaluateJavascript(js, null);
                            Log.d(TAG, "⚡⚡⚡ NATIVE CLOSE DIRECTLY TRIGGERED IN WEBVIEW!");
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Lỗi closeQRDirectly: " + e.getMessage());
                    }
                }
            });
        }
    }

    private final BroadcastReceiver bankNotifReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent == null) return;
            long amount = intent.getLongExtra("amount", 0);
            String title = intent.getStringExtra("title");
            String text = intent.getStringExtra("text");

            if (title == null) title = "";
            if (text == null) text = "";

            Log.d(TAG, "⚡ Đã nhận Broadcast tiền về từ Android Service: amount=" + amount);

            // BẬT ÂM LƯỢNG ĐIỆN THOẠI LÊN MỨC TỐI ĐA 100%
            maximizeSystemVolume();

            final String safeTitle = title.replace("'", "\\'").replace("\n", " ");
            final String safeText = text.replace("'", "\\'").replace("\n", " ");

            final String js = String.format(
                "(function(){ try { console.log('⚡ WebView executing closeQROrder...'); if(window.closeQROrder) { window.closeQROrder(); } else { window.dispatchEvent(new CustomEvent('bank_payment_received', { detail: { amount: %d, title: '%s', text: '%s' } })); } } catch(e){ console.error(e); } })();",
                amount, safeTitle, safeText
            );

            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        if (getBridge() != null && getBridge().getWebView() != null) {
                            getBridge().getWebView().evaluateJavascript(js, null);
                            Log.d(TAG, "⚡ Đã bắn Javascript closeQROrder & CustomEvent bank_payment_received vào WebView!");
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Lỗi evaluateJavascript: " + e.getMessage());
                    }
                }
            });
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        instance = this;
        initNativeTts();
        registerBankReceiver();
        setupJavascriptInterface();
    }

    private void setupJavascriptInterface() {
        try {
            if (getBridge() != null && getBridge().getWebView() != null) {
                final android.content.Context ctx = getApplicationContext();
                getBridge().getWebView().addJavascriptInterface(new Object() {
                    @android.webkit.JavascriptInterface
                    public void speak(String text) {
                        Log.d(TAG, "🗣️ Frontend gọi speakNativeText: " + text);
                        speakNativeText(text);
                    }

                    @android.webkit.JavascriptInterface
                    public void setCurrentOrder(String itemsText) {
                        // Lưu tên món ăn vào SharedPreferences để Service đọc vế 2 natively
                        android.content.SharedPreferences prefs = ctx.getSharedPreferences("SushiShopPrefs", android.content.Context.MODE_PRIVATE);
                        prefs.edit().putString("current_order_items", itemsText).apply();
                        Log.d(TAG, "📦 Đã lưu order items vào SharedPreferences: " + itemsText);
                    }
                }, "AndroidNativeTTS");
                Log.d(TAG, "✅ Đã đăng ký AndroidNativeTTS JavascriptInterface thành công!");
            }
        } catch (Exception e) {
            Log.e(TAG, "Lỗi đăng ký JavascriptInterface: " + e.getMessage());
        }
    }

    private void initNativeTts() {
        try {
            tts = new TextToSpeech(getApplicationContext(), this);
        } catch (Exception e) {
            Log.e(TAG, "Lỗi khởi tạo Native TTS: " + e.getMessage());
        }
    }

    @Override
    public void onInit(int status) {
        if (status == TextToSpeech.SUCCESS && tts != null) {
            try {
                int result = tts.setLanguage(new Locale("vi", "VN"));
                if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                    tts.setLanguage(Locale.getDefault());
                }
                tts.setSpeechRate(0.95f);
                isTtsReady = true;
                Log.d(TAG, "✅ Native TextToSpeech Android đã sẵn sàng!");
            } catch (Exception e) {
                Log.e(TAG, "Lỗi cài ngôn ngữ TTS: " + e.getMessage());
            }
        } else {
            Log.e(TAG, "Lỗi khởi tạo TTS Android, thử lại...");
            isTtsReady = false;
        }
    }


    public void speakNativeText(String text) {
        maximizeSystemVolume();
        if (isTtsReady && tts != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                tts.speak(text, TextToSpeech.QUEUE_ADD, null, "BANK_TTS_ID_" + System.currentTimeMillis());
            } else {
                tts.speak(text, TextToSpeech.QUEUE_ADD, null);
            }
        }
    }

    private void maximizeSystemVolume() {
        try {
            AudioManager audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
            if (audioManager != null) {
                int maxVol = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
                audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, maxVol, 0);
            }
        } catch (Exception e) {
            Log.e(TAG, "Lỗi tăng âm lượng: " + e.getMessage());
        }
    }

    private void registerBankReceiver() {
        IntentFilter filter = new IntentFilter(BankNotificationListenerService.ACTION_BANK_NOTIF);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(bankNotifReceiver, filter, Context.RECEIVER_NOT_EXPORTED);
        } else {
            registerReceiver(bankNotifReceiver, filter);
        }
    }

    @Override
    public void onDestroy() {
        if (tts != null) {
            tts.stop();
            tts.shutdown();
        }
        super.onDestroy();
        try {
            unregisterReceiver(bankNotifReceiver);
        } catch (Exception ignored) {}
    }
}
