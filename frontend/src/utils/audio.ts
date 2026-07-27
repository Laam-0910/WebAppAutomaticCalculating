import { Invoice } from '../types';

declare const responsiveVoice: {
  speak: (text: string, voice: string, options?: { rate?: number; pitch?: number; volume?: number; onstart?: () => void; onend?: () => void }) => void;
  cancel: () => void;
  isPlaying: () => boolean;
  voiceSupport: () => boolean;
};

// ── Dùng 1 AudioContext duy nhất ──
let _audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return null;
    if (!_audioCtx || _audioCtx.state === 'closed') _audioCtx = new Ctx();
    if (_audioCtx.state === 'suspended') _audioCtx.resume();
    return _audioCtx;
  } catch { return null; }
}

// ── Khởi tạo workaround âm thanh Android (gọi 1 lần khi app load) ──
let _audioInitialized = false;
export const initAudioWorkarounds = (): void => {
  if (_audioInitialized) return;
  _audioInitialized = true;

  // Resume AudioContext + speechSynthesis khi quay lại app
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      if (_audioCtx?.state === 'suspended') _audioCtx.resume();
      if ('speechSynthesis' in window) window.speechSynthesis.resume();
    }
  });

  // Giữ speechSynthesis sống mỗi 10 giây (Android Chrome bug)
  setInterval(() => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }
  }, 10000);

  // Unlock AudioContext khi người dùng chạm lần đầu
  const unlock = () => {
    getAudioCtx();
    document.removeEventListener('touchstart', unlock);
    document.removeEventListener('click', unlock);
  };
  document.addEventListener('touchstart', unlock, { passive: true });
  document.addEventListener('click', unlock, { passive: true });
};

// ── Phát chuông Keng Keng 4 nốt POS ──
export const playChimeSound = (): void => {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [
      { freq: 523.25, start: 0.00, dur: 0.35 },
      { freq: 659.25, start: 0.20, dur: 0.35 },
      { freq: 783.99, start: 0.40, dur: 0.50 },
      { freq: 1046.5, start: 0.65, dur: 0.70 },
    ].forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);
      gain.gain.setValueAtTime(1.0, now + start);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur + 0.05);
    });
  } catch (e) { console.warn('Chime error:', e); }
};

// ── Phát MP3 từ backend TTS proxy (đáng tin cậy nhất trên Android APK) ──
async function playTtsMp3(text: string): Promise<boolean> {
  try {
    const clean = text.replace(/[,!.]/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 130);
    const encoded = encodeURIComponent(clean);

    // fetch localhost không bị CORS — lấy MP3 dưới dạng ArrayBuffer
    const res = await fetch(`http://localhost:8080/api/tts?text=${encoded}`, {
      method: 'GET',
      headers: { 'Accept': 'audio/mpeg' },
    });

    if (!res.ok) {
      console.warn('Backend TTS HTTP', res.status);
      return false;
    }

    const arrayBuffer = await res.arrayBuffer();
    const ctx = getAudioCtx();
    if (!ctx) return false;

    // Decode MP3 và phát qua AudioContext (cùng kênh với chuông keng keng)
    const buffer = await ctx.decodeAudioData(arrayBuffer);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();
    console.log('✅ TTS MP3 backend phát thành công qua AudioContext');
    return true;
  } catch (e) {
    console.warn('Backend TTS thất bại:', e);
    return false;
  }
}


// ── Đọc giọng Tiếng Việt — Ưu tiên: Android Native TTS → Backend MP3 → ResponsiveVoice → Web Speech ──
export const speakVietnameseText = async (text: string): Promise<void> => {
  const cleanText = text.replace(/[,!.]/g, ' ').replace(/\s+/g, ' ').trim();

  // Phương án 0: Gọi trực tiếp Native Android TTS (RẤT MẠNH TRÊN APK, KHÔNG PHỤ THUỘK WEBVIEW)
  if (typeof (window as any).AndroidNativeTTS !== 'undefined') {
    try {
      (window as any).AndroidNativeTTS.speak(cleanText);
      console.log('✅ Đã phát giọng đọc qua AndroidNativeTTS Interface');
      return;
    } catch (e) {
      console.warn('Native TTS Interface error:', e);
    }
  }

  // Phương án 1: Backend TTS MP3 (qua AudioContext)
  const mp3Ok = await playTtsMp3(cleanText);
  if (mp3Ok) return;

  // Phương án 2: ResponsiveVoice CDN
  if (typeof responsiveVoice !== 'undefined' && responsiveVoice.voiceSupport()) {
    try {
      if (responsiveVoice.isPlaying()) responsiveVoice.cancel();
      responsiveVoice.speak(cleanText, 'Vietnamese Female', { rate: 0.9, pitch: 1.0, volume: 1.0 });
      return;
    } catch (e) { console.warn('ResponsiveVoice fallback:', e); }
  }

  // Phương án 3: Web Speech API
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang.toLowerCase().startsWith('vi'));
    const utt = new SpeechSynthesisUtterance(cleanText);
    utt.lang = 'vi-VN';
    utt.rate = 0.92;
    utt.volume = 1.0;
    utt.pitch = viVoice ? 1.0 : 1.55;
    if (viVoice) utt.voice = viVoice;
    utt.onerror = (e) => {
      if (e.error !== 'interrupted') {
        setTimeout(() => { window.speechSynthesis.resume(); window.speechSynthesis.speak(utt); }, 300);
      }
    };
    window.speechSynthesis.speak(utt);
    return;
  }

  // Phương án 4: Google Direct Stream
  try {
    const audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(cleanText.substring(0, 120))}`);
    audio.volume = 1.0;
    await audio.play();
  } catch (e) { console.warn('Google TTS stream error:', e); }
};


// ── Thông báo đa kênh khi nhận tiền (Cho Tiền Mặt) ──
export const announcePaymentSuccess = (invoice: Invoice): void => {
  if (navigator?.vibrate) {
    try { navigator.vibrate([200, 100, 200, 100, 400]); } catch { /* skip */ }
  }

  // 1. Phát tiếng keng keng keng
  playChimeSound();

  // 2. Đọc "Đã nhận thành công [Số tiền] đồng" (Không đọc "Bao gồm")
  const amountText = new Intl.NumberFormat('vi-VN').format(invoice.amount);
  const speechText = `Đã nhận thành công ${amountText} đồng`;

  setTimeout(() => {
    speakVietnameseText(speechText);
  }, 400);
};

export const buildPaymentNotificationText = (invoice: Invoice): string => {
  const amountText = new Intl.NumberFormat('vi-VN').format(invoice.amount) + ' đ';
  const itemsText = invoice.order?.items?.map(i => `${i.quantity} ${i.menuItemName}`).join(' • ') ?? '';
  return `✅ ĐÃ NHẬN TIỀN: ${amountText}${itemsText ? ' — ' + itemsText : ''}`;
};
