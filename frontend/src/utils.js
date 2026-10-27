/* ─────────────────────────────────────────────────────────────
   utils.js — Weather fetching, voice helpers, localStorage
   ───────────────────────────────────────────────────────────── */

import { CLIMATE_DEFAULTS } from './mappings'

// ── Weather from Open-Meteo (free, no API key) ─────────────

/**
 * Fetches current-day weather for the given lat/lon from Open-Meteo.
 * Returns { temperature, humidity, rainfall }.
 * Falls back to CLIMATE_DEFAULTS on any error.
 */
export async function fetchWeather(lat, lon) {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,rain&timezone=auto`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) throw new Error(res.status)
    const data = await res.json()
    const c = data.current
    return {
      temperature: Math.round(c.temperature_2m),
      humidity:    Math.round(c.relative_humidity_2m),
      rainfall:    Math.round((c.rain || 0) * 30), // scale daily mm → approx monthly mm
    }
  } catch {
    return null
  }
}

/**
 * Quick geocode: resolve a place name to lat/lon using Open-Meteo Geocoding.
 */
export async function geocode(placeName) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(placeName)}&count=1&language=en&format=json`
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) })
    if (!res.ok) throw new Error(res.status)
    const data = await res.json()
    if (data.results && data.results.length > 0) {
      const r = data.results[0]
      return { lat: r.latitude, lon: r.longitude, name: r.name }
    }
    return null
  } catch {
    return null
  }
}

// ── GPS ─────────────────────────────────────────────────────

export function getGPSPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('not supported'))
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 10000 }
    )
  })
}

// ── Voice (Web Speech API) ──────────────────────────────────

// Preload voices to ensure they are available when speak() is called
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices()
  }
}

let currentAudio = null;
let currentUtterance = null;

/**
 * Stop any active voice playback immediately (both Web Speech and audio streams).
 */
export function stopSpeaking() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {}
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
    currentUtterance = null;
  }
}

/**
 * Speak a text string aloud.
 * Supports: English (en-IN), Telugu (te-IN), Hindi (hi-IN),
 * Kannada (kn-IN), Tamil (ta-IN), Marathi (mr-IN).
 * Automatically uses high-fidelity streaming audio fallback if
 * the user's OS/browser lacks native regional TTS voices.
 */
export function speak(text, voiceCode = 'en-IN', callbacks = {}) {
  const { onStart, onEnd } = callbacks;
  stopSpeaking();
  if (!text) {
    if (onEnd) onEnd();
    return;
  }

  const langCode = (voiceCode || 'en-IN').split('-')[0].toLowerCase();

  // Strip emojis and markdown symbols to prevent speech synthesis glitches
  const cleanText = text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/[*#_~`>]/g, ' ')
    .trim();

  if (!cleanText) {
    if (onEnd) onEnd();
    return;
  }

  // Check if the browser actually has a voice installed for this language
  let matchingVoice = null;
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    const voices = window.speechSynthesis.getVoices();
    matchingVoice = voices.find(v => {
      const vLang = v.lang.replace('_', '-').toLowerCase();
      return vLang === voiceCode.toLowerCase() || vLang.startsWith(langCode);
    });
  }

  // Windows / Chrome almost never install Telugu, Kannada, Tamil, or Marathi voices by default.
  // When no voice is installed or for regional languages, stream pristine native audio from /api/tts!
  const preferAudioStream = !matchingVoice || ['te', 'kn', 'ta', 'mr'].includes(langCode);

  if (preferAudioStream) {
    const audioUrl = `/api/tts?lang=${encodeURIComponent(langCode)}&text=${encodeURIComponent(cleanText.slice(0, 300))}`;
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    audio.onplay = () => {
      if (onStart) onStart();
    };
    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null;
      if (onEnd) onEnd();
    };
    audio.onerror = () => {
      // If audio stream fails, fallback to web speech
      if (currentAudio === audio) currentAudio = null;
      speakWithWebSpeech(cleanText, voiceCode, matchingVoice, onStart, onEnd);
    };

    audio.play().catch(() => {
      speakWithWebSpeech(cleanText, voiceCode, matchingVoice, onStart, onEnd);
    });
    return;
  }

  speakWithWebSpeech(cleanText, voiceCode, matchingVoice, onStart, onEnd);
}

function speakWithWebSpeech(text, voiceCode, voice, onStart, onEnd) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
  } catch {}

  // Chrome bug workaround: small delay after cancel prevents silent abort
  setTimeout(() => {
    try {
      const utter = new SpeechSynthesisUtterance(text);
      currentUtterance = utter;
      window.__cropwise_active_utter = utter; // Prevent V8 garbage collection

      utter.lang = voiceCode;
      utter.rate = 0.95;
      if (voice) utter.voice = voice;

      utter.onstart = () => {
        if (onStart) onStart();
      };
      utter.onend = () => {
        currentUtterance = null;
        if (onEnd) onEnd();
      };
      utter.onerror = () => {
        currentUtterance = null;
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utter);
    } catch {
      if (onEnd) onEnd();
    }
  }, 40);
}

/**
 * Listen via microphone and return recognised text.
 * Returns a promise that resolves with the transcript string.
 */
export function listen(langCode = 'en-IN') {
  return new Promise((resolve, reject) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return reject(new Error('not supported'))
    const recognition = new SR()
    recognition.lang = langCode
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (e) => resolve(e.results[0][0].transcript)
    recognition.onerror = (e) => reject(e)
    recognition.start()
  })
}

export const speechSupported = typeof window !== 'undefined' && !!window.speechSynthesis
export const micSupported = typeof window !== 'undefined' &&
  !!(window.SpeechRecognition || window.webkitSpeechRecognition)

// ── localStorage persistence ────────────────────────────────

const STORAGE_KEY = 'crop_ai_wizard'

export function saveProgress(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function clearProgress() {
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
}
