package com.sushishop.app;

import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.os.Build;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class BankNotificationListenerService extends NotificationListenerService implements TextToSpeech.OnInitListener {
    private static final String TAG = "BankNotifListener";
    public static final String ACTION_BANK_NOTIF = "com.sushishop.app.BANK_NOTIFICATION_RECEIVED";
    private TextToSpeech tts;
    private boolean isTtsReady = false;

    @Override
    public void onCreate() {
        super.onCreate();
        try {
            tts = new TextToSpeech(this, this);
        } catch (Exception e) {
            Log.e(TAG, "Lỗi tạo TTS trong Service: " + e.getMessage());
        }
    }

    @Override
    public void onInit(int status) {
        if (status == TextToSpeech.SUCCESS) {
            if (tts != null) {
                tts.setLanguage(new Locale("vi", "VN"));
                tts.setSpeechRate(0.95f);
            }
            isTtsReady = true;
            Log.d(TAG, "✅ Service Native TTS Android đã sẵn sàng!");
        }
    }

    private void playChimeBeep() {
        try {
            android.media.ToneGenerator toneGen = new android.media.ToneGenerator(android.media.AudioManager.STREAM_MUSIC, 100);
            toneGen.startTone(android.media.ToneGenerator.TONE_PROP_BEEP, 150);
            try { Thread.sleep(180); } catch (InterruptedException ignored) {}
            toneGen.startTone(android.media.ToneGenerator.TONE_PROP_BEEP2, 200);
        } catch (Exception e) {
            Log.e(TAG, "Lỗi phát tiếng keng: " + e.getMessage());
        }
    }

    private void speakDirectly(String speechText) {
        try {
            AudioManager audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
            if (audioManager != null) {
                int maxVol = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
                audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, maxVol, 0);
            }
            if (isTtsReady && tts != null) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    tts.speak(speechText, TextToSpeech.QUEUE_FLUSH, null, "DIRECT_TTS_ID");
                } else {
                    tts.speak(speechText, TextToSpeech.QUEUE_FLUSH, null);
                }
                Log.d(TAG, "🗣️ ĐÃ ĐỌC TRỰC TIẾP TỪ SERVICE: " + speechText);
            }
        } catch (Exception e) {
            Log.e(TAG, "Lỗi phát âm thanh trực tiếp: " + e.getMessage());
        }
    }

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        if (sbn == null || sbn.getNotification() == null) return;

        Bundle extras = sbn.getNotification().extras;
        if (extras == null) return;

        String title = extras.getString("android.title", "");
        CharSequence textChar = extras.getCharSequence("android.text");
        String text = textChar != null ? textChar.toString() : "";
        String packageName = sbn.getPackageName() != null ? sbn.getPackageName() : "";

        String combined = (title + " " + text).toLowerCase();
        String pkgLower = packageName.toLowerCase();

        Log.d(TAG, "📩 Bắt được thông báo từ [" + packageName + "]: Title=" + title + " | Text=" + text);

        boolean isBankOrMsgApp = pkgLower.contains("mbmobile") || pkgLower.contains("mb") || 
                pkgLower.contains("mms") || pkgLower.contains("sms") || pkgLower.contains("message") ||
                combined.contains("mb") || combined.contains("mbbank") ||
                combined.contains("vcb") || combined.contains("vietcombank") || combined.contains("tcb") ||
                combined.contains("momo") || combined.contains("zalopay");

        // 🛑 BỎ QUA GIAO DỊCH TRỪ TIỀN (DẤU TRỪ - / TIỀN RA)
        if (combined.contains("gd: -") || combined.contains("gd:-") || combined.contains(" trừ ") || combined.contains(" tru ")) {
            Log.d(TAG, "⏭️ Bỏ qua thông báo TRỪ TIỀN / Tiền ra.");
            return;
        }

        boolean hasPlusOrCredit = combined.contains("+") || combined.contains("cong") || combined.contains("cộng") ||
                combined.contains("nhan") || combined.contains("nhận") || combined.contains("tăng") || combined.contains("tang");

        if (!isBankOrMsgApp || !hasPlusOrCredit) {
            return;
        }

        Log.d(TAG, "⚡ THÔNG BÁO TIỀN VÀO HỢP LỆ! Tiến hành trích xuất số tiền...");

        long parsedAmount = parseAmountFromText(title + " " + text);
        String contentText = extractTransactionContent(text);

        // 🔊 NATIVE OS LEVEL: ĐỌC VẾ 1 TỨC THÌ 100%
        if (parsedAmount > 0) {
            String amountFormatted = String.format(Locale.US, "%,d", parsedAmount).replace(",", ".");
            speakDirectly("Đã nhận thành công " + amountFormatted + " đồng.");

            // 🔊 ĐỌC VẾ 2 SAU 2 GIÂY: Bao gồm [tên các món] — đọc HOÀN TOÀN NATIVE
            final String finalAmountFormatted = amountFormatted;
            android.os.Handler handler = new android.os.Handler(android.os.Looper.getMainLooper());
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    try {
                        android.content.SharedPreferences prefs = getApplicationContext()
                            .getSharedPreferences("SushiShopPrefs", android.content.Context.MODE_PRIVATE);
                        String itemsText = prefs.getString("current_order_items", "");
                        if (itemsText != null && !itemsText.isEmpty()) {
                            speakDirectly("Bao gồm: " + itemsText);
                            Log.d(TAG, "🗣️ Đã đọc vế 2 native: Bao gồm: " + itemsText);
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Lỗi đọc vế 2: " + e.getMessage());
                    }
                }
            }, 2000);
        }

        // Gửi Broadcast sang Frontend để tự động đóng màn hình QR
        Intent intent = new Intent(ACTION_BANK_NOTIF);
        intent.putExtra("packageName", packageName);
        intent.putExtra("title", title);
        intent.putExtra("text", text);
        intent.putExtra("amount", parsedAmount);
        intent.putExtra("content", contentText);

        sendBroadcast(intent);

        // ⚡ GỌI TRỰC TIẾP TRÊN NATIVE MAIN ACTIVITY ĐỂ TẮT MÀN HÌNH QR NGAY LẬP TỨC
        MainActivity.closeQRDirectly();
    }

    private String extractTransactionContent(String text) {
        if (text == null || text.isEmpty()) return "";
        try {
            // Tìm cụm |ND: ... trong thông báo MBBank
            if (text.contains("|ND:")) {
                String[] parts = text.split("\\|ND:");
                if (parts.length > 1) {
                    String raw = parts[1].trim();
                    // Loại bỏ ký tự đặc biệt/mã đơn không đọc tốt
                    return raw.replaceAll("[^a-zA-Z0-9 àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđĐ]", " ");
                }
            }
        } catch (Exception ignored) {}
        return "";
    }

    @Override
    public void onDestroy() {
        if (tts != null) {
            tts.stop();
            tts.shutdown();
        }
        super.onDestroy();
    }


    private long parseAmountFromText(String text) {
        if (text == null || text.isEmpty()) return 0;
        try {
            String lower = text.toLowerCase();

            // Pattern 1: Tìm bất kỳ chuỗi dạng "+7,000", "+7.000", "+ 7000", "gd: +7,000"
            Pattern patternPlus = Pattern.compile("\\+\\s*([0-9.,]+)");
            Matcher matcherPlus = patternPlus.matcher(lower);
            if (matcherPlus.find()) {
                String cleanNum = matcherPlus.group(1).replaceAll("[.,]", "");
                if (!cleanNum.isEmpty()) {
                    long amount = Long.parseLong(cleanNum);
                    Log.d(TAG, "🎯 Trích xuất chuẩn dấu cộng: +" + amount);
                    return amount;
                }
            }

            // Pattern 2: Dạng "gd: 7,000", "cộng 7.000", "nhận 7000"
            Pattern patternKeyword = Pattern.compile("(?:gd:|cộng|cong|nhan|nhận|tăng|tang)\\s*:?\\s*\\+?\\s*([0-9.,]+)");
            Matcher matcherKeyword = patternKeyword.matcher(lower);
            if (matcherKeyword.find()) {
                String cleanNum = matcherKeyword.group(1).replaceAll("[.,]", "");
                if (!cleanNum.isEmpty()) {
                    long amount = Long.parseLong(cleanNum);
                    Log.d(TAG, "🎯 Trích xuất theo từ khóa: " + amount);
                    return amount;
                }
            }

            // Pattern 3: Cắt bỏ phần |sd: số dư để tìm số tiền giao dịch đứng trước
            String textBeforeSD = lower.split("\\|sd:")[0];
            Pattern pattern2 = Pattern.compile("([0-9.,]+)\\s*(?:vnd|đ|d|k)");
            Matcher matcher2 = pattern2.matcher(textBeforeSD);
            if (matcher2.find()) {
                String cleanNum = matcher2.group(1).replaceAll("[.,]", "");
                if (!cleanNum.isEmpty()) {
                    long val = Long.parseLong(cleanNum);
                    if (lower.contains("k") && val < 100000) val *= 1000;
                    Log.d(TAG, "🎯 Trích xuất đơn vị VND: " + val);
                    return val;
                }
            }

            return 0;
        } catch (Exception e) {
            Log.e(TAG, "Lỗi trích xuất số tiền: " + e.getMessage());
            return 0;
        }
    }


}
