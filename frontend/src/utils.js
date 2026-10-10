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

/**
 * Speak a text string aloud. voiceCode e.g. 'te-IN', 'hi-IN', 'en-IN'.
 */
export function speak(text, voiceCode = 'en-IN') {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = voiceCode
  utter.rate = 0.9

  // Try to find a matching voice
  const voices = window.speechSynthesis.getVoices()
  const targetPrefix = voiceCode.split('-')[0].toLowerCase()
  
  const match = 
    voices.find(v => v.lang.replace('_', '-').toLowerCase() === voiceCode.toLowerCase()) ||
    voices.find(v => v.lang.toLowerCase().startsWith(targetPrefix)) ||
    voices.find(v => v.name.toLowerCase().includes(targetPrefix))

  if (match) {
    utter.voice = match
  }
  
  window.speechSynthesis.speak(utter)
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
