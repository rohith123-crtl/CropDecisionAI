/* ─────────────────────────────────────────────────────────────
   App.jsx — Farmer-friendly wizard for Crop Decision AI
   ───────────────────────────────────────────────────────────── */
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Sun, Moon, MapPin, Wifi, WifiOff, ChevronRight, RotateCcw, Volume2, Check, Leaf, Droplets, Target, TrendingUp, Shield, Scale, Star, Award } from 'lucide-react';
import { t, LANGUAGES } from './i18n';
import {
  SOIL_COLOR_MAP, GROWTH_MULTIPLIER, AREA_DEFAULTS, CLIMATE_DEFAULTS,
  detectSeason, buildApiPayload, suitabilityLabel, suitabilityColor,
  isSoilValid
} from './mappings';
import {
  fetchWeather, geocode, getGPSPosition,
  speak, speechSupported, saveProgress, loadProgress, clearProgress,
} from './utils';

// Import our Design System Components
import { WizardStep } from './components/WizardStep';
import { PictureCard } from './components/PictureCard';
import { ProgressBar } from './components/ProgressBar';
import { ScoreCounter } from './components/ScoreCounter';
import { SeedlingLoader } from './components/SeedlingLoader';

const API = '/api';

/* ── Step metadata with icons ───────────────────────────────── */
const STEP_META = [
  null, // step 0: lang
  { icon: <MapPin size={18} />, label: 'Location & Season' },
  { icon: <Leaf size={18} />, label: 'Soil Profile' },
  { icon: <Droplets size={18} />, label: 'Water & Area' },
  { icon: <RotateCcw size={18} />, label: 'Previous Crop' },
  { icon: <Target size={18} />, label: 'Your Goal' },
];

/* ═══════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════ */
export default function App({ profile, onSaved } = {}) {
  const [saved] = useState(() => profile ? null : loadProgress());
  const weatherRequest = useRef(0);
  const [lang, setLang] = useState(saved?.lang || 'en');

  const [step, setStep] = useState(saved?.step || 0);
  const [direction, setDirection] = useState(1);

  const [online, setOnline] = useState(navigator.onLine);

  const [location, setLocation] = useState(saved?.location || profile?.location || '');
  const [climate, setClimate] = useState(saved?.climate || { ...CLIMATE_DEFAULTS });
  const [weatherStatus, setWeatherStatus] = useState('');
  const [season, setSeason] = useState(saved?.season || detectSeason());

  const [soilPath, setSoilPath] = useState(saved?.soilPath || '');
  const [soilValues, setSoilValues] = useState(saved?.soilValues || { ...AREA_DEFAULTS });
  const [soilColor, setSoilColor] = useState(saved?.soilColor || '');
  const [growthLevel, setGrowthLevel] = useState(saved?.growthLevel || 'average');

  const [waterSource, setWaterSource] = useState(saved?.waterSource || 'borewell');
  const [farmArea, setFarmArea] = useState(saved?.farmArea || profile?.farm_area || 2);
  const [previousCrop, setPreviousCrop] = useState(saved?.previousCrop || 'rice');
  const [objective, setObjective] = useState(saved?.objective || 'balanced');

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  useEffect(() => {
    if (!profile && step > 0 && step < 6) {
      saveProgress({ lang, step, location, climate, season, soilPath, soilValues, soilColor, growthLevel, waterSource, farmArea, previousCrop, objective });
    }
  }, [lang, step, location, climate, season, soilPath, soilValues, soilColor, growthLevel, waterSource, farmArea, previousCrop, objective]);

  const voiceCode = LANGUAGES.find(l => l.code === lang)?.voiceCode || 'en-IN';

  const resolveWeather = async (lat, lon, request) => {
    const w = await fetchWeather(lat, lon);
    if (request !== weatherRequest.current) return;
    setClimate(w || { ...CLIMATE_DEFAULTS });
    setWeatherStatus(w ? 'done' : 'error');
  };

  const handleGPS = async () => {
    const request = ++weatherRequest.current;
    setWeatherStatus('loading');
    setClimate({ ...CLIMATE_DEFAULTS });
    try {
      const pos = await getGPSPosition();
      if (request !== weatherRequest.current) return;
      setLocation(pos.lat.toFixed(2) + ', ' + pos.lon.toFixed(2));
      await resolveWeather(pos.lat, pos.lon, request);
    } catch {
      if (request === weatherRequest.current) setWeatherStatus('error');
    }
  };

  const handleLocationSubmit = async () => {
    if (!location.trim() || weatherStatus === 'done') return;
    const request = ++weatherRequest.current;
    setWeatherStatus('loading');
    setClimate({ ...CLIMATE_DEFAULTS });
    const geo = await geocode(location);
    if (request !== weatherRequest.current) return;
    if (geo) {
      setLocation(geo.name);
      await resolveWeather(geo.lat, geo.lon, request);
    } else {
      setWeatherStatus('error');
    }
  };

  const finalizeSoil = () => {
    if (soilPath === 'simple' && soilColor) {
      const base = SOIL_COLOR_MAP[soilColor];
      const mult = GROWTH_MULTIPLIER[growthLevel];
      setSoilValues({
        nitrogen: Math.round(base.nitrogen * mult),
        phosphorus: Math.round(base.phosphorus * mult),
        potassium: Math.round(base.potassium * mult),
        ph: base.ph,
        soil_type: base.soil_type,
      });
    } else if (soilPath === 'area') {
      setSoilValues({ ...AREA_DEFAULTS });
    }
  };

  const submitWizard = async () => {
    setLoading(true); setError('');
    const payload = buildApiPayload({
      soilValues, climate, season, waterSource, farmArea, previousCrop, objective, location
    });
    try {
      const res = await fetch(`${API}/recommend`, {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-Crop-Client': 'web' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(typeof data?.detail === 'string' ? data.detail : null);
      setResults(data.recommendations);
      onSaved?.();
      clearProgress();
      setDirection(1);
      setStep(6);
    } catch (err) {
      setError(err?.message || t(lang, 'requestError'));
    } finally { setLoading(false); }
  };

  const soilValid = isSoilValid(soilPath, soilColor, soilValues);

  const goNext = () => {
    if (loading || weatherStatus === 'loading' || (step === 2 && !soilValid)) return;
    setDirection(1);
    if (step === 2) finalizeSoil();
    if (step === 5) { submitWizard(); return; }
    setStep(s => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep(s => Math.max(0, s - 1));
  };

  const restart = () => {
    clearProgress();
    setDirection(-1);
    setStep(0);
    setResults(null);
    setError('');
  };

  const totalSteps = 5;

  return (
    <Shell lang={lang} setLang={setLang} voiceCode={voiceCode}>
      <div className="max-w-[720px] mx-auto min-h-0 flex flex-col pt-2">

        {/* Offline banner */}
        {!online && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mx-4 mb-4 p-3 rounded-2xl flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium"
          >
            <WifiOff size={16} className="flex-shrink-0" />
            {t(lang, 'offline')}
          </motion.div>
        )}

        {/* Step progress indicator */}
        {step >= 1 && step <= 5 && (
          <div className="mx-4 mb-6">
            {/* Step pills */}
            <div className="flex items-center gap-1.5 mb-3">
              {STEP_META.slice(1).map((meta, i) => {
                const sn = i + 1;
                const isActive = sn === step;
                const isDone = sn < step;
                return (
                  <div
                    key={sn}
                    className={`flex items-center gap-1.5 flex-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                      isActive ? 'bg-primary text-white shadow-soft' :
                      isDone ? 'bg-primary/15 text-primary' :
                      'bg-border/60 text-text-secondary'
                    }`}
                  >
                    <span className={`${isActive ? 'text-white' : isDone ? 'text-primary' : 'text-text-secondary'}`}>
                      {isDone ? <Check size={12} strokeWidth={3} /> : meta.icon}
                    </span>
                    <span className="hidden sm:block truncate">{meta.label}</span>
                    <span className="sm:hidden">{sn}</span>
                  </div>
                );
              })}
            </div>
            {/* Progress bar */}
            <ProgressBar progress={(step / totalSteps) * 100} className="h-1.5" />
            <div className="flex justify-between mt-1.5 text-xs text-text-secondary font-medium">
              <span>{t(lang, 'stepOf', step, totalSteps)}</span>
              <span>{Math.round((step / totalSteps) * 100)}% complete</span>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col relative px-4 pb-32 overflow-hidden">
          {error && (
            <motion.p
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              role="alert"
              className="p-4 mb-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium flex items-start gap-3"
            >
              <span className="text-lg mt-0.5">⚠️</span> {error}
            </motion.p>
          )}
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <SeedlingLoader />
            </div>
          ) : (
            <AnimatePresence mode="wait" custom={direction}>

              {/* ── STEP 0: Language ── */}
              {step === 0 && (
                <WizardStep key="step0" direction={direction}>
                  <div className="p-4 sm:p-8 mb-auto mt-2 max-w-[560px] mx-auto w-full">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-[22px] bg-primary/10 text-primary mb-4">
                        <span className="text-3xl">🌱</span>
                      </div>
                      <h1 className="text-3xl font-bold text-text-primary mb-2">{t(lang, 'langTitle')}</h1>
                      <p className="text-base text-text-secondary">{t(lang, 'langHint')}</p>
                    </div>
                    <div className="space-y-3 mb-8">
                      {LANGUAGES.map(l => (
                        <motion.button
                          key={l.code}
                          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                          onClick={() => setLang(l.code)}
                          className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 backdrop-blur-md ${
                            lang === l.code
                              ? 'border-primary bg-primary/12 shadow-soft'
                              : 'border-border/60 bg-surface/35 hover:border-primary/40 hover:bg-surface/60'
                          }`}
                        >
                          <span className="text-3xl">{l.code === 'en' ? '🇬🇧' : '🇮🇳'}</span>
                          <div className="flex-1">
                            <div className="text-lg font-bold text-text-primary">{l.native}</div>
                            <div className="text-sm text-text-secondary">{l.label}</div>
                          </div>
                          {lang === l.code && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                              <Check size={13} className="text-white" strokeWidth={3} />
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                    <BigButton onClick={goNext} label={t(lang, 'next')} />
                  </div>
                </WizardStep>
              )}

              {/* ── STEP 1: Location ── */}
              {step === 1 && (
                <WizardStep key="step1" direction={direction}>
                  <StepHeader lang={lang} voiceCode={voiceCode} titleKey="locationTitle" hintKey="locationHint"
                    icon={<MapPin size={22} />} stepColor="text-water" stepBg="bg-water/10" />
                  <div className="space-y-4">
                    {/* Location input card */}
                    <div className="card-surface p-5">
                      <div className="relative mb-3">
                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                        <input
                          type="text" value={location}
                          onChange={e => {
                            ++weatherRequest.current;
                            setLocation(e.target.value);
                            setWeatherStatus('');
                            setClimate({ ...CLIMATE_DEFAULTS });
                          }}
                          onBlur={handleLocationSubmit}
                          placeholder={t(lang, 'locationPlaceholder')}
                          className="w-full pl-11 pr-4 py-4 rounded-2xl border-2 border-border text-base focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all bg-surface/70"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        onClick={handleGPS}
                        className="w-full p-4 rounded-2xl border-2 border-dashed border-water/50 text-water font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-water/5 transition-all"
                      >
                        <MapPin size={16} /> {t(lang, 'useGPS')}
                      </motion.button>
                    </div>

                    {/* Weather status */}
                    <AnimatePresence mode="wait">
                      {weatherStatus === 'loading' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-3 p-4 rounded-2xl bg-water/8 border border-water/20 text-water text-sm font-medium">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                            <Droplets size={16} />
                          </motion.div>
                          {t(lang, 'weatherLoading')}
                        </motion.div>
                      )}
                      {weatherStatus === 'done' && (
                        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-3 p-4 rounded-2xl bg-primary/8 border border-primary/20 text-primary text-sm font-semibold">
                          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <Check size={14} className="text-white" strokeWidth={3} />
                          </div>
                          <div>
                            <div>{t(lang, 'weatherLoaded')}</div>
                            <div className="text-xs font-normal text-text-secondary mt-0.5">{climate.temperature}°C · {climate.humidity}% humidity</div>
                          </div>
                        </motion.div>
                      )}
                      {weatherStatus === 'error' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                          {t(lang, 'weatherError')}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Season selector */}
                    <div className="card-surface p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">🌤️</span>
                        <div className="text-sm font-bold text-text-secondary uppercase tracking-wider">{t(lang, 'season')}</div>
                      </div>
                      <div className="text-2xl font-bold text-primary mb-4">{t(lang, season)}</div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'kharif', emoji: '🌧️', label: 'Kharif' },
                          { id: 'rabi', emoji: '❄️', label: 'Rabi' },
                          { id: 'zaid', emoji: '☀️', label: 'Zaid' },
                        ].map(s => (
                          <motion.button
                            key={s.id}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setSeason(s.id)}
                            className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl text-sm font-semibold transition-all border-2 ${
                              season === s.id
                                ? 'bg-primary text-white border-primary shadow-soft'
                                : 'bg-surface border-border text-text-secondary hover:border-primary/40'
                            }`}
                          >
                            <span className="text-xl">{s.emoji}</span>
                            <span>{t(lang, s.id).split(' ')[0]}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </WizardStep>
              )}

              {/* ── STEP 2: Soil ── */}
              {step === 2 && (
                <WizardStep key="step2" direction={direction}>
                  <StepHeader lang={lang} voiceCode={voiceCode} titleKey="soilTitle" hintKey="soilHint"
                    icon={<Leaf size={22} />} stepColor="text-primary" stepBg="bg-primary/10" />

                  {!soilPath && (
                    <div className="space-y-3">
                      {[
                        {
                          id: 'simple', emoji: '🤷', label: t(lang, 'soilPathSimple'),
                          desc: 'Answer two simple questions', badge: 'Recommended',
                          badgeColor: 'bg-accent text-white'
                        },
                        { id: 'card', emoji: '🪪', label: t(lang, 'soilPathCard'), desc: 'Enter lab report numbers' },
                        { id: 'area', emoji: '📍', label: t(lang, 'soilPathArea'), desc: 'Use regional averages' },
                      ].map(path => (
                        <motion.button
                          key={path.id}
                          whileHover={{ scale: 1.015, y: -2 }} whileTap={{ scale: 0.99 }}
                          onClick={() => {
                            setSoilPath(path.id);
                            if (path.id === 'area') setSoilValues({ ...AREA_DEFAULTS });
                          }}
                          className="relative w-full p-5 rounded-3xl border-2 border-border bg-surface text-left flex items-center gap-5 hover:border-primary/50 shadow-soft transition-all"
                        >
                          {path.badge && (
                            <span className={`absolute -top-2.5 right-5 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${path.badgeColor}`}>
                              {path.badge}
                            </span>
                          )}
                          <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center text-3xl flex-shrink-0">
                            {path.emoji}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-lg text-text-primary">{path.label}</div>
                            <div className="text-sm text-text-secondary mt-0.5">{path.desc}</div>
                          </div>
                          <ChevronRight size={20} className="text-text-secondary flex-shrink-0" />
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {soilPath === 'simple' && (
                    <div className="space-y-5">
                      <button onClick={() => setSoilPath('')} className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                        ← {t(lang, 'back')}
                      </button>

                      <div className="card-surface p-5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">🌍</span>
                          <h3 className="font-bold text-xl">{t(lang, 'soilColorTitle')}</h3>
                        </div>
                        <p className="text-sm text-text-secondary mb-5">{t(lang, 'soilColorHint')}</p>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: 'black', img: '/assets/soil_black.jpg', label: t(lang, 'soilBlack'), color: '#2c1810' },
                            { id: 'red', img: '/assets/soil_red.jpg', label: t(lang, 'soilRed'), color: '#8b3a2a' },
                            { id: 'sandy', img: '/assets/soil_sandy.jpg', label: t(lang, 'soilSandy'), color: '#c4a35a' },
                            { id: 'clay', img: '/assets/soil_clay.jpg', label: t(lang, 'soilClay'), color: '#7a6040' },
                          ].map(s => (
                            <motion.button
                              key={s.id}
                              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                              onClick={() => setSoilColor(s.id)}
                              className={`relative aspect-square rounded-3xl border-2 overflow-hidden transition-all ${
                                soilColor === s.id ? 'border-primary ring-4 ring-primary/20 shadow-hoverPop' : 'border-border hover:border-primary/40'
                              }`}
                            >
                              {/* Soil color swatch (fallback if no image) */}
                              <div className="absolute inset-0 flex flex-col">
                                <div className="flex-1 min-h-0 relative overflow-hidden">
                                  {s.img ? (
                                    <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full" style={{ backgroundColor: s.color }} />
                                  )}
                                  {/* Gradient overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                </div>
                                <div className={`absolute bottom-0 left-0 right-0 p-3 ${soilColor === s.id ? 'bg-primary/90' : 'bg-black/40'} transition-colors`}>
                                  <div className="text-white font-bold text-sm text-center">{s.label}</div>
                                </div>
                              </div>
                              {soilColor === s.id && (
                                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md z-10">
                                  <Check size={13} className="text-white" strokeWidth={3} />
                                </div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div className="card-surface p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl">🌿</span>
                          <h3 className="font-bold text-xl">{t(lang, 'growthTitle')}</h3>
                        </div>
                        <div className="space-y-3">
                          {[
                            { id: 'poor', emoji: '😟', label: t(lang, 'growthPoor'), color: 'border-red-300 bg-red-50 text-red-700', active: 'border-red-400 bg-red-50' },
                            { id: 'average', emoji: '😐', label: t(lang, 'growthAverage'), color: 'border-amber-300 bg-amber-50 text-amber-700', active: 'border-amber-400 bg-amber-50' },
                            { id: 'good', emoji: '😊', label: t(lang, 'growthGood'), color: 'border-green-300 bg-green-50 text-green-700', active: 'border-green-400 bg-green-50' },
                          ].map(g => (
                            <motion.button
                              key={g.id} whileTap={{ scale: 0.99 }}
                              onClick={() => setGrowthLevel(g.id)}
                              className={`w-full p-4 rounded-2xl border-2 text-left font-semibold transition-all flex items-center gap-4 ${
                                growthLevel === g.id
                                  ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/10'
                                  : 'border-border bg-surface text-text-primary hover:border-primary/40'
                              }`}
                            >
                              <span className="text-3xl">{g.emoji}</span>
                              <span>{g.label}</span>
                              {growthLevel === g.id && <Check size={18} className="ml-auto text-primary" strokeWidth={3} />}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {soilPath === 'card' && (
                    <div className="card-surface p-6">
                      <button onClick={() => setSoilPath('')} className="text-primary font-semibold hover:underline mb-5 text-sm flex items-center gap-1">
                        ← {t(lang, 'back')}
                      </button>
                      <div className="flex items-center gap-2 mb-5">
                        <span className="text-2xl">🪪</span>
                        <h3 className="font-bold text-xl">{t(lang, 'soilCardTitle')}</h3>
                      </div>
                      <div className="space-y-5">
                        {[
                          { field: 'nitrogen', icon: '🌿', unit: 'kg/ha', range: '0–300' },
                          { field: 'phosphorus', icon: '⚗️', unit: 'kg/ha', range: '0–300' },
                          { field: 'potassium', icon: '🔋', unit: 'kg/ha', range: '0–300' },
                          { field: 'ph', icon: '⚖️', unit: 'pH', range: '3–10', step: '0.1' },
                        ].map(({ field, icon, unit, range, step: fieldStep }) => (
                          <div key={field} className="group">
                            <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary mb-2">
                              <span>{icon}</span>
                              {t(lang, `${field}Label`)}
                              <span className="text-xs font-normal text-text-secondary/70 ml-auto">{unit} · {range}</span>
                            </label>
                            <input
                              type="number"
                              step={fieldStep || (field === 'ph' ? '0.1' : '1')}
                              min={field === 'ph' ? '3' : '0'}
                              max={field === 'ph' ? '10' : '300'}
                              value={soilValues[field]}
                              onChange={e => setSoilValues(v => ({ ...v, [field]: e.target.value === '' ? '' : Number(e.target.value) }))}
                              className="w-full p-3.5 rounded-2xl border-2 border-border text-lg focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all mt-1 bg-white/80 font-semibold"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {soilPath === 'area' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                      className="card-surface p-6 border-primary/30 bg-primary/5 text-center"
                    >
                      <div className="text-4xl mb-3">📍</div>
                      <div className="text-primary font-bold text-lg mb-1">Regional averages selected</div>
                      <div className="text-sm text-text-secondary">{t(lang, 'soilPathArea')}</div>
                      <button onClick={() => setSoilPath('')} className="mt-4 text-primary text-sm font-semibold hover:underline">
                        Change selection →
                      </button>
                    </motion.div>
                  )}
                </WizardStep>
              )}

              {/* ── STEP 3: Water & Area ── */}
              {step === 3 && (
                <WizardStep key="step3" direction={direction}>
                  <div className="space-y-5">
                    <div>
                      <StepHeader lang={lang} voiceCode={voiceCode} titleKey="waterTitle" hintKey="waterHint"
                        icon={<Droplets size={22} />} stepColor="text-water" stepBg="bg-water/10" />
                      <div className="space-y-3">
                        {[
                          { id: 'rain', emoji: '🌧️', label: t(lang, 'waterRain'), desc: t(lang, 'waterRainDesc') },
                          { id: 'canal', emoji: '🏞️', label: t(lang, 'waterCanal'), desc: t(lang, 'waterCanalDesc') },
                          { id: 'borewell', emoji: '🔧', label: t(lang, 'waterBorewell'), desc: t(lang, 'waterBorewellDesc') },
                          { id: 'drip', emoji: '💧', label: t(lang, 'waterDrip'), desc: t(lang, 'waterDripDesc') },
                        ].map(w => (
                          <motion.button
                            key={w.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                            onClick={() => setWaterSource(w.id)}
                            className={`w-full p-4 rounded-3xl border-2 text-left transition-all flex items-center gap-4 ${
                              waterSource === w.id
                                ? 'border-water bg-water/5 ring-4 ring-water/10 shadow-soft'
                                : 'border-border bg-surface hover:border-water/40'
                            }`}
                          >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                              waterSource === w.id ? 'bg-water/15' : 'bg-background'
                            }`}>
                              {w.emoji}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-base text-text-primary">{w.label}</div>
                              <div className="text-sm text-text-secondary mt-0.5">{w.desc}</div>
                            </div>
                            {waterSource === w.id && (
                              <div className="w-6 h-6 rounded-full bg-water flex items-center justify-center flex-shrink-0">
                                <Check size={13} className="text-white" strokeWidth={3} />
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Farm area */}
                    <div className="card-surface p-6">
                      <StepHeader lang={lang} voiceCode={voiceCode} titleKey="areaTitle" hintKey="areaHint"
                        icon={<Target size={22} />} stepColor="text-accent" stepBg="bg-accent/10" compact />
                      <div className="text-center my-6">
                        <motion.div
                          className="inline-flex items-end justify-center gap-2"
                          key={farmArea}
                          initial={{ scale: 0.85, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <span className="text-6xl font-black text-primary tracking-tight">{farmArea}</span>
                          <div className="mb-2">
                            <div className="text-lg font-semibold text-text-secondary">{t(lang, 'acres')}</div>
                            <div className="text-xs text-text-secondary">{Math.round(farmArea * 40)} {t(lang, 'guntas')}</div>
                          </div>
                        </motion.div>
                      </div>
                      <input
                        type="range" min="0.5" max="25" step="0.5" value={farmArea}
                        onChange={e => setFarmArea(Number(e.target.value))}
                        className="w-full h-4 bg-border rounded-full appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs font-semibold text-text-secondary mt-3 px-1">
                        <span>0.5 ac</span><span>12.5 ac</span><span>25 ac</span>
                      </div>
                    </div>
                  </div>
                </WizardStep>
              )}

              {/* ── STEP 4: Previous Crop ── */}
              {step === 4 && (
                <WizardStep key="step4" direction={direction}>
                  <StepHeader lang={lang} voiceCode={voiceCode} titleKey="prevCropTitle" hintKey="prevCropHint"
                    icon={<RotateCcw size={22} />} stepColor="text-earth" stepBg="bg-earth/10" />
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'rice', emoji: '🌾', label: t(lang, 'rice'), color: '#e8f5e9' },
                      { id: 'maize', emoji: '🌽', label: t(lang, 'maize'), color: '#fffde7' },
                      { id: 'groundnut', emoji: '🥜', label: t(lang, 'groundnut'), color: '#fff3e0' },
                      { id: 'cotton', emoji: '☁️', label: t(lang, 'cotton'), color: '#e3f2fd' },
                      { id: 'chickpea', emoji: '🫘', label: t(lang, 'chickpea'), color: '#fce4ec' },
                      { id: 'soybean', emoji: '🫛', label: t(lang, 'soybean'), color: '#e8f5e9' },
                      { id: 'millet', emoji: '🌿', label: t(lang, 'millet'), color: '#f1f8e9' },
                      { id: 'none', emoji: '🏜️', label: t(lang, 'noCrop'), color: '#fafafa' },
                    ].map(c => (
                      <motion.button
                        key={c.id}
                        whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setPreviousCrop(c.id)}
                        className={`p-5 rounded-3xl border-2 text-center transition-all flex flex-col items-center justify-center relative overflow-hidden ${
                          previousCrop === c.id
                            ? 'border-primary bg-primary/10 shadow-hoverPop'
                            : 'border-border bg-surface hover:border-primary/40'
                        }`}
                        style={{ minHeight: 120 }}
                      >
                        {/* Subtle tint background */}
                        {previousCrop !== c.id && (
                          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundColor: c.color }} />
                        )}
                        {previousCrop === c.id && (
                          <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check size={11} className="text-white" strokeWidth={3} />
                          </div>
                        )}
                        <div className="text-4xl mb-2.5 drop-shadow-sm relative z-10">{c.emoji}</div>
                        <div className={`font-bold text-sm relative z-10 ${previousCrop === c.id ? 'text-primary' : 'text-text-primary'}`}>
                          {c.label}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </WizardStep>
              )}

              {/* ── STEP 5: Objective ── */}
              {step === 5 && (
                <WizardStep key="step5" direction={direction}>
                  <StepHeader lang={lang} voiceCode={voiceCode} titleKey="objectiveTitle" hintKey="objectiveHint"
                    icon={<Target size={22} />} stepColor="text-accent" stepBg="bg-accent/10" />
                  <div className="space-y-3">
                    {[
                      { id: 'profit', icon: <TrendingUp size={22} />, emoji: '💰', label: t(lang, 'objProfit'), desc: t(lang, 'objProfitDesc'), color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { id: 'safe', icon: <Shield size={22} />, emoji: '🛡️', label: t(lang, 'objSafe'), desc: t(lang, 'objSafeDesc'), color: 'text-blue-600', bg: 'bg-blue-50' },
                      { id: 'water', icon: <Droplets size={22} />, emoji: '💧', label: t(lang, 'objWater'), desc: t(lang, 'objWaterDesc'), color: 'text-sky-600', bg: 'bg-sky-50' },
                      { id: 'balanced', icon: <Scale size={22} />, emoji: '⚖️', label: t(lang, 'objBalanced'), desc: t(lang, 'objBalancedDesc'), color: 'text-purple-600', bg: 'bg-purple-50' },
                    ].map(o => (
                      <motion.button
                        key={o.id} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.99 }}
                        onClick={() => setObjective(o.id)}
                        className={`w-full p-5 rounded-3xl border-2 text-left transition-all flex items-center gap-4 ${
                          objective === o.id
                            ? 'border-primary bg-primary/5 shadow-soft ring-4 ring-primary/10'
                            : 'border-border bg-surface hover:border-primary/40'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                          objective === o.id ? 'bg-primary/15' : o.bg + ' opacity-80'
                        }`}>
                          {o.emoji}
                        </div>
                        <div className="flex-1">
                          <div className={`font-bold text-lg mb-0.5 ${objective === o.id ? 'text-primary' : 'text-text-primary'}`}>{o.label}</div>
                          <div className="text-sm text-text-secondary">{o.desc}</div>
                        </div>
                        {objective === o.id && (
                          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <Check size={14} className="text-white" strokeWidth={3} />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </WizardStep>
              )}

              {/* ── STEP 6: Results ── */}
              {step === 6 && results && (
                <WizardStep key="step6" direction={direction}>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', damping: 12 }}
                      className="inline-block text-6xl mb-4"
                    >🎉</motion.div>
                    <h1 className="text-3xl font-black text-text-primary mb-2">{t(lang, 'resultsTitle')}</h1>
                    <p className="text-base text-text-secondary">{t(lang, 'resultsHint')}</p>
                    {/* Summary chips */}
                    <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                      <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        📍 {location || 'Your location'}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-accent/10 text-earth text-xs font-semibold">
                        🌤️ {t(lang, season)}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-water/10 text-water text-xs font-semibold">
                        📐 {farmArea} {t(lang, 'acres')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-5 mb-8">
                    {results.map((r, i) => (
                      <motion.div key={r.crop} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
                        <ResultCard r={r} rank={i + 1} lang={lang} voiceCode={voiceCode} />
                      </motion.div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start gap-3 mb-8">
                    <span className="text-base mt-0.5 flex-shrink-0">⚠️</span>
                    {t(lang, 'disclaimer')}
                  </div>

                  <BigButton onClick={restart} label={t(lang, 'tryAgain')} variant="outline" />
                </WizardStep>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Sticky Bottom Nav */}
        {step >= 1 && step <= 5 && !loading && (
          <div className="glass-footer">
            <div className="max-w-[720px] mx-auto flex gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={goBack}
                className="px-5 py-4 rounded-2xl font-semibold text-text-secondary hover:bg-background transition-colors min-h-[56px] border-2 border-border"
              >
                ← {t(lang, 'back')}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={goNext}
                disabled={loading || weatherStatus === 'loading' || (step === 2 && !soilValid)}
                className="flex-1 btn-primary text-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {step === 5 ? (
                  <span className="flex items-center justify-center gap-2">
                    <Leaf size={18} /> {t(lang, 'seeResults')}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {t(lang, 'next')} <ChevronRight size={18} />
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════════════════════════
   UI COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function Shell({ children }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className="w-full text-text-primary font-sans relative"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 transition duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(46, 125, 50, 0.08),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

function StepHeader({ lang, voiceCode, titleKey, hintKey, icon, stepColor = 'text-primary', stepBg = 'bg-primary/10', compact = false }) {
  return (
    <div className={`${compact ? 'mb-3' : 'mb-5'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {icon && (
            <div className={`w-10 h-10 rounded-xl ${stepBg} ${stepColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              {icon}
            </div>
          )}
          <div>
            <h2 className={`font-bold text-text-primary leading-tight tracking-tight ${compact ? 'text-xl' : 'text-2xl'}`}>
              {t(lang, titleKey)}
            </h2>
            {!compact && <p className="text-sm text-text-secondary mt-1.5">{t(lang, hintKey)}</p>}
          </div>
        </div>
        {speechSupported && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => speak(t(lang, titleKey) + '. ' + t(lang, hintKey), voiceCode)}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-water/10 text-water flex items-center justify-center hover:bg-water/20 transition-colors"
            title="Read aloud"
          >
            <Volume2 size={16} />
          </motion.button>
        )}
      </div>
      {compact && <p className="text-sm text-text-secondary mt-1 ml-13">{t(lang, hintKey)}</p>}
    </div>
  );
}

function BigButton({ onClick, label, variant = 'primary' }) {
  const cls = variant === 'outline'
    ? 'border-2 border-primary text-primary hover:bg-primary/5 bg-transparent'
    : 'bg-primary text-white hover:bg-primary-hover shadow-soft hover:shadow-hoverPop';

  return (
    <motion.button
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full py-4 rounded-2xl font-bold text-lg transition-all min-h-[58px] flex items-center justify-center gap-2 ${cls}`}
    >
      {label}
      {variant === 'primary' && <ChevronRight size={20} />}
    </motion.button>
  );
}

export function ResultCard({ r, rank, lang, voiceCode }) {
  const scorePercent = Math.round(r.suitability);
  const sc = suitabilityColor(scorePercent);
  const label = t(lang, suitabilityLabel(scorePercent));
  const isTop = rank === 1;

  const [expanded, setExpanded] = useState(false);

  const translateReason = (text) => {
    if (text === "Soil nutrient and pH profile is compatible.") return t(lang, 'reasonSoil');
    if (text === "Current temperature, humidity and rainfall are favorable.") return t(lang, 'reasonClimate');
    if (text === "Available water covers most of the estimated crop requirement.") return t(lang, 'reasonWaterGood');
    if (text === "Available water may be insufficient for the estimated requirement.") return t(lang, 'reasonWaterBad');
    if (text === "The selected season is less suitable for this crop.") return t(lang, 'reasonSeasonBad');
    if (text === "Growing the same crop repeatedly can reduce rotation compatibility.") return t(lang, 'reasonRotation');
    if (text === "The demo market outlook factor is favorable.") return t(lang, 'reasonMarket');
    if (text.includes("is a suitable season for this crop.")) {
      const s = text.split(" ")[0].toLowerCase();
      return t(lang, 'reasonSeasonGood', t(lang, s).split(' ')[0] || s);
    }
    return text;
  };

  const translatedReasons = r.reasons.map(translateReason);
  const translatedRisks = r.risks.map(translateReason);
  const whyText = translatedReasons.slice(0, 3).join(' ');
  const cropNameKey = r.crop.toLowerCase();
  const displayCrop = t(lang, cropNameKey) === cropNameKey ? r.crop : t(lang, cropNameKey);

  // Score color
  const scoreBg = scorePercent >= 75 ? 'from-primary to-emerald-400' :
                  scorePercent >= 55 ? 'from-amber-400 to-yellow-300' :
                  'from-red-400 to-orange-400';

  const rankBadge = [null, '🥇', '🥈', '🥉'][rank] || `#${rank}`;

  return (
    <div className={`card-surface border-2 transition-all relative overflow-hidden ${
      isTop ? 'border-primary ring-4 ring-primary/10 shadow-hoverPop' : 'border-border'
    }`}>

      {/* Top accent bar */}
      {isTop && (
        <div className="h-1 bg-gradient-to-r from-primary via-emerald-400 to-accent w-full" />
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-4 mb-4">
          {/* Rank badge */}
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
            isTop ? 'bg-primary/10' : 'bg-background'
          }`}>
            {rankBadge}
          </div>

          {/* Crop info */}
          <div className="flex-1 min-w-0">
            {isTop && (
              <div className="flex items-center gap-1.5 mb-1">
                <Award size={13} className="text-accent" />
                <span className="text-xs font-black text-accent uppercase tracking-wider">Top Recommendation</span>
              </div>
            )}
            <h3 className="text-2xl font-black text-text-primary leading-tight">{displayCrop}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-lg">{sc.emoji}</span>
              <span className="font-semibold text-sm" style={{ color: sc.text }}>{label}</span>
            </div>
          </div>

          {/* Score circle */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${scoreBg} flex items-center justify-center shadow-soft`}>
              <div className="text-center">
                <ScoreCounter value={scorePercent} className="text-xl font-black text-white" />
                <div className="text-white text-xs font-bold opacity-90">%</div>
              </div>
            </div>
            <span className="text-xs text-text-secondary mt-1 font-medium">Suitability</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-border rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(to right, ${sc.text}, ${sc.text}90)` }}
            initial={{ width: 0 }}
            animate={{ width: `${scorePercent}%` }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          />
        </div>

        {/* Reasons */}
        <div className="bg-background rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm text-text-primary flex items-center gap-2">
              <Star size={14} className="text-accent" />
              {t(lang, 'whyThisCrop')}
            </h4>
            {speechSupported && (
              <button
                onClick={() => speak(displayCrop + '. ' + whyText, voiceCode)}
                className="w-8 h-8 rounded-full bg-water/10 text-water flex items-center justify-center hover:bg-water/20 transition-colors"
              >
                <Volume2 size={13} />
              </button>
            )}
          </div>
          <ul className="space-y-2">
            {translatedReasons.slice(0, expanded ? translatedReasons.length : 3).map((reason, i) => (
              <li key={i} className="text-sm text-text-secondary flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-primary/15 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={10} strokeWidth={3} />
                </span>
                {reason}
              </li>
            ))}
          </ul>

          {translatedRisks.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border">
              <h4 className="font-bold text-sm text-earth mb-2 flex items-center gap-1.5">
                <span>⚠️</span> {t(lang, 'warnings')}
              </h4>
              <ul className="space-y-2">
                {translatedRisks.map((risk, i) => (
                  <li key={i} className="text-sm text-earth flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0">•</span> {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {translatedReasons.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 text-xs text-primary font-semibold hover:underline"
            >
              {expanded ? '↑ Show less' : `↓ Show ${translatedReasons.length - 3} more reasons`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
