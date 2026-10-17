/* ─────────────────────────────────────────────────────────────
   App.jsx — Farmer-friendly wizard for Crop Decision AI
   ───────────────────────────────────────────────────────────── */
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
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

// Import our new Design System Components
import { WizardStep } from './components/WizardStep';
import { PictureCard } from './components/PictureCard';
import { ProgressBar } from './components/ProgressBar';
import { ScoreCounter } from './components/ScoreCounter';
import { SeedlingLoader } from './components/SeedlingLoader';

const API = '/api';

/* ═══════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════ */
export default function App({ profile, onSaved } = {}) {
  const [saved] = useState(() => profile ? null : loadProgress());
  const weatherRequest = useRef(0);
  const [lang, setLang] = useState(saved?.lang || 'en');

  const [step, setStep] = useState(saved?.step || 0); // 0=lang, 1–5=wizard, 6=results
  const [direction, setDirection] = useState(1); // 1 for next, -1 for back

  const [online, setOnline] = useState(navigator.onLine);

  // Wizard answers
  const [location, setLocation] = useState(saved?.location || profile?.location || '');
  const [climate, setClimate] = useState(saved?.climate || { ...CLIMATE_DEFAULTS });
  const [weatherStatus, setWeatherStatus] = useState(''); // '' | 'loading' | 'done' | 'error'
  const [season, setSeason] = useState(saved?.season || detectSeason());

  const [soilPath, setSoilPath] = useState(saved?.soilPath || ''); // 'card' | 'simple' | 'area'
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

  // Connectivity listener
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  // Save progress whenever answers change
  useEffect(() => {
    if (!profile && step > 0 && step < 6) {
      saveProgress({ lang, step, location, climate, season, soilPath, soilValues, soilColor, growthLevel, waterSource, farmArea, previousCrop, objective });
    }
  }, [lang, step, location, climate, season, soilPath, soilValues, soilColor, growthLevel, waterSource, farmArea, previousCrop, objective]);

  const voiceCode = LANGUAGES.find(l => l.code === lang)?.voiceCode || 'en-IN';

  // Fetch weather when location is resolved to coords
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
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResults(data.recommendations);
      onSaved?.();
      clearProgress();
      setDirection(1);
      setStep(6);
    } catch {
      setError(t(lang, 'requestError'));
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
      <div className="max-w-[720px] mx-auto min-h-[100dvh] flex flex-col pt-4">

        {/* Offline banner */}
        {!online && <div className="mx-4 mb-4 p-3 rounded-2xl bg-accent/20 border border-accent/40 text-earth text-sm font-medium">⚠️ {t(lang, 'offline')}</div>}

        {/* Top Progress Bar for wizard steps */}
        {step >= 1 && step <= 5 && (
          <div className="mx-4 mb-8">
            <div className="flex justify-between text-sm font-semibold text-text-secondary mb-3">
              <span>{t(lang, 'stepOf', step, totalSteps)}</span>
            </div>
            <ProgressBar progress={(step / totalSteps) * 100} />
          </div>
        )}

        <div className="flex-1 flex flex-col relative px-4 pb-32 overflow-hidden">
          {error && <p role="alert" className="p-4 mb-4 rounded-2xl bg-red-100 text-red-800">{error}</p>}
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <SeedlingLoader />
            </div>
          ) : (
            <AnimatePresence mode="wait" custom={direction}>
              {/* ── STEP 0: Language ── */}
              {step === 0 && (
                <WizardStep key="step0" direction={direction}>
                  <div className="card-surface p-6 mb-auto mt-4">
                    <h1 className="text-3xl font-bold text-text-primary mb-2 text-center">{t(lang, 'langTitle')}</h1>
                    <p className="text-base text-text-secondary mb-8 text-center">{t(lang, 'langHint')}</p>
                    <div className="space-y-4 mb-8">
                      {LANGUAGES.map(l => (
                        <button key={l.code} onClick={() => setLang(l.code)}
                          className={`w-full p-5 rounded-2xl border-2 text-left text-lg font-semibold transition-all ${lang === l.code ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-white text-text-primary hover:border-primary/50'}`}>
                          <span className="text-2xl mr-4">{l.code === 'en' ? '🇬🇧' : '🇮🇳'}</span>
                          {l.native} <span className="text-sm font-normal text-text-secondary ml-2">{l.label}</span>
                        </button>
                      ))}
                    </div>
                    <BigButton onClick={goNext} label={t(lang, 'next')} />
                  </div>
                </WizardStep>
              )}

              {/* ── STEP 1: Location ── */}
              {step === 1 && (
                <WizardStep key="step1" direction={direction}>
                  <StepHeader lang={lang} voiceCode={voiceCode} titleKey="locationTitle" hintKey="locationHint" />
                  <div className="card-surface p-5 mb-auto">
                    <div className="space-y-4 mb-6">
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
                        className="w-full p-4 rounded-2xl border-2 border-border text-lg focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                      />
                      <button onClick={handleGPS} className="w-full p-4 rounded-2xl border-2 border-dashed border-primary/50 text-primary font-semibold text-base flex items-center justify-center gap-2 hover:bg-primary/5 transition-all">
                        📍 {t(lang, 'useGPS')}
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {weatherStatus === 'loading' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4 rounded-2xl bg-water/10 text-water font-medium mb-4">
                          {t(lang, 'weatherLoading')}
                        </motion.div>
                      )}
                      {weatherStatus === 'done' && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-medium mb-4">
                          ✅ {t(lang, 'weatherLoaded')} — {climate.temperature}°C, {climate.humidity}%
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {weatherStatus === 'error' && <p role="status" className="mb-4 text-earth">{t(lang, 'weatherError')}</p>}

                    {/* Season auto-detect */}
                    <div className="p-5 rounded-2xl bg-background border border-border">
                      <div className="text-sm font-semibold text-text-secondary mb-1">{t(lang, 'season')}</div>
                      <div className="text-2xl font-bold text-primary mb-4">{t(lang, season)}</div>
                      <div className="flex gap-2">
                        {['kharif', 'rabi', 'zaid'].map(s => (
                          <button key={s} onClick={() => setSeason(s)}
                            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${season === s ? 'bg-primary text-white shadow-soft' : 'bg-surface border-2 border-border text-text-secondary hover:border-primary/50'}`}>
                            {t(lang, s).split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </WizardStep>
              )}

              {/* ── STEP 2: Soil ── */}
              {step === 2 && (
                <WizardStep key="step2" direction={direction}>
                  <StepHeader lang={lang} voiceCode={voiceCode} titleKey="soilTitle" hintKey="soilHint" />

                  {!soilPath && (
                    <div className="space-y-4">
                      <PathCard emoji="🤷" label={t(lang, 'soilPathSimple')} desc="Answer two simple questions" onClick={() => setSoilPath('simple')} recommended />
                      <PathCard emoji="🪪" label={t(lang, 'soilPathCard')} desc="Enter lab report numbers" onClick={() => setSoilPath('card')} />
                      <PathCard emoji="📍" label={t(lang, 'soilPathArea')} desc="Use regional averages" onClick={() => { setSoilPath('area'); setSoilValues({ ...AREA_DEFAULTS }); }} />
                    </div>
                  )}

                  {soilPath === 'simple' && (
                    <div className="space-y-6">
                      <button onClick={() => setSoilPath('')} className="text-primary font-semibold hover:underline">← {t(lang, 'back')}</button>

                      <div className="card-surface p-5">
                        <h3 className="font-bold text-xl mb-1">{t(lang, 'soilColorTitle')}</h3>
                        <p className="text-sm text-text-secondary mb-4">{t(lang, 'soilColorHint')}</p>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: 'black', img: '/assets/soil_black.jpg', label: t(lang, 'soilBlack') },
                            { id: 'red', img: '/assets/soil_red.jpg', label: t(lang, 'soilRed') },
                            { id: 'sandy', img: '/assets/soil_sandy.jpg', label: t(lang, 'soilSandy') },
                            { id: 'clay', img: '/assets/soil_clay.jpg', label: t(lang, 'soilClay') },
                          ].map(s => (
                            <PictureCard key={s.id} imageSrc={s.img} title={s.label} isSelected={soilColor === s.id}
                              onClick={() => setSoilColor(s.id)} />
                          ))}
                        </div>
                      </div>

                      <div className="card-surface p-5">
                        <h3 className="font-bold text-xl mb-1">{t(lang, 'growthTitle')}</h3>
                        <div className="space-y-3 mt-4">
                          {[
                            { id: 'poor', emoji: '😟', label: t(lang, 'growthPoor') },
                            { id: 'average', emoji: '😐', label: t(lang, 'growthAverage') },
                            { id: 'good', emoji: '😊', label: t(lang, 'growthGood') },
                          ].map(g => (
                            <button key={g.id} onClick={() => setGrowthLevel(g.id)}
                              className={`w-full p-4 rounded-2xl border-2 text-left font-semibold transition-all flex items-center gap-4 ${growthLevel === g.id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text-primary hover:border-primary/50'}`}>
                              <span className="text-3xl">{g.emoji}</span> {g.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {soilPath === 'card' && (
                    <div className="card-surface p-6">
                      <button onClick={() => setSoilPath('')} className="text-primary font-semibold hover:underline mb-4">← {t(lang, 'back')}</button>
                      <h3 className="font-bold text-xl mb-4">{t(lang, 'soilCardTitle')}</h3>
                      <div className="space-y-5">
                        {['nitrogen', 'phosphorus', 'potassium', 'ph'].map(field => (
                          <div key={field}>
                            <label className="text-sm font-semibold text-text-secondary">{t(lang, `${field.charAt(0) === 'p' && field.length <= 2 ? 'ph' : field}Label`)}</label>
                            <input type="number" step={field === 'ph' ? '0.1' : '1'} min={field === 'ph' ? '3' : '0'} max={field === 'ph' ? '10' : '300'}
                              value={soilValues[field]} onChange={e => setSoilValues(v => ({ ...v, [field]: e.target.value === '' ? '' : Number(e.target.value) }))}
                              className="w-full p-3 rounded-xl border-2 border-border text-lg focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all mt-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {soilPath === 'area' && (
                    <div className="card-surface p-6 bg-primary/5 border-primary/20 text-primary text-center">
                      ✅ {t(lang, 'soilPathArea')} Selected
                    </div>
                  )}
                </WizardStep>
              )}

              {/* ── STEP 3: Water & Area ── */}
              {step === 3 && (
                <WizardStep key="step3" direction={direction}>
                  <div className="space-y-8">
                    <div>
                      <StepHeader lang={lang} voiceCode={voiceCode} titleKey="waterTitle" hintKey="waterHint" />
                      <div className="space-y-3">
                        {[
                          { id: 'rain', emoji: '🌧️', label: t(lang, 'waterRain'), desc: t(lang, 'waterRainDesc') },
                          { id: 'canal', emoji: '🏞️', label: t(lang, 'waterCanal'), desc: t(lang, 'waterCanalDesc') },
                          { id: 'borewell', emoji: '🔧', label: t(lang, 'waterBorewell'), desc: t(lang, 'waterBorewellDesc') },
                          { id: 'drip', emoji: '💧', label: t(lang, 'waterDrip'), desc: t(lang, 'waterDripDesc') },
                        ].map(w => (
                          <button key={w.id} onClick={() => setWaterSource(w.id)}
                            className={`w-full p-4 rounded-3xl border-2 text-left transition-all flex items-center gap-4 ${waterSource === w.id ? 'border-primary bg-primary/5 ring-4 ring-primary/10 shadow-soft' : 'border-border bg-surface hover:border-primary/50'}`}>
                            <span className="text-4xl bg-background p-3 rounded-2xl">{w.emoji}</span>
                            <div>
                              <div className="font-bold text-lg text-text-primary mb-0.5">{w.label}</div>
                              <div className="text-sm text-text-secondary">{w.desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="card-surface p-6">
                      <StepHeader lang={lang} voiceCode={voiceCode} titleKey="areaTitle" hintKey="areaHint" />
                      <div className="text-center mb-6 mt-4 relative">
                        <motion.div
                          className="inline-flex items-end justify-center"
                          key={farmArea}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <span className="text-6xl font-black text-primary tracking-tight">{farmArea}</span>
                          <span className="text-xl font-semibold text-text-secondary ml-2 mb-1">{t(lang, 'acres')}</span>
                        </motion.div>
                        <div className="text-sm text-text-secondary mt-1">({Math.round(farmArea * 40)} {t(lang, 'guntas')})</div>
                      </div>
                      <input type="range" min="0.5" max="25" step="0.5" value={farmArea}
                        onChange={e => setFarmArea(Number(e.target.value))}
                        className="w-full h-4 bg-border rounded-full appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm font-medium text-text-secondary mt-3">
                        <span>0.5</span><span>12</span><span>25</span>
                      </div>
                    </div>
                  </div>
                </WizardStep>
              )}

              {/* ── STEP 4: Previous Crop ── */}
              {step === 4 && (
                <WizardStep key="step4" direction={direction}>
                  <StepHeader lang={lang} voiceCode={voiceCode} titleKey="prevCropTitle" hintKey="prevCropHint" />
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'rice', emoji: '🌾', label: t(lang, 'rice') },
                      { id: 'maize', emoji: '🌽', label: t(lang, 'maize') },
                      { id: 'groundnut', emoji: '🥜', label: t(lang, 'groundnut') },
                      { id: 'cotton', emoji: '☁️', label: t(lang, 'cotton') },
                      { id: 'chickpea', emoji: '🫘', label: t(lang, 'chickpea') },
                      { id: 'soybean', emoji: '🫛', label: t(lang, 'soybean') },
                      { id: 'millet', emoji: '🌿', label: t(lang, 'millet') },
                      { id: 'none', emoji: '🏜️', label: t(lang, 'noCrop') },
                    ].map(c => (
                      <button key={c.id} onClick={() => setPreviousCrop(c.id)}
                        className={`p-6 rounded-3xl border-2 text-center transition-all flex flex-col items-center justify-center aspect-square ${previousCrop === c.id ? 'border-primary bg-primary/10 shadow-soft scale-[1.02]' : 'border-border bg-surface hover:border-primary/50 hover:scale-[1.02]'}`}>
                        <div className="text-5xl mb-3 drop-shadow-sm">{c.emoji}</div>
                        <div className="font-bold text-lg text-text-primary">{c.label}</div>
                      </button>
                    ))}
                  </div>
                </WizardStep>
              )}

              {/* ── STEP 5: Objective ── */}
              {step === 5 && (
                <WizardStep key="step5" direction={direction}>
                  <StepHeader lang={lang} voiceCode={voiceCode} titleKey="objectiveTitle" hintKey="objectiveHint" />
                  <div className="space-y-4">
                    {[
                      { id: 'profit', emoji: '💰', label: t(lang, 'objProfit'), desc: t(lang, 'objProfitDesc') },
                      { id: 'safe', emoji: '🛡️', label: t(lang, 'objSafe'), desc: t(lang, 'objSafeDesc') },
                      { id: 'water', emoji: '💧', label: t(lang, 'objWater'), desc: t(lang, 'objWaterDesc') },
                      { id: 'balanced', emoji: '⚖️', label: t(lang, 'objBalanced'), desc: t(lang, 'objBalancedDesc') },
                    ].map(o => (
                      <button key={o.id} onClick={() => setObjective(o.id)}
                        className={`w-full p-5 rounded-3xl border-2 text-left transition-all flex items-center gap-5 ${objective === o.id ? 'border-primary bg-primary/5 shadow-soft ring-4 ring-primary/10' : 'border-border bg-surface hover:border-primary/50'}`}>
                        <span className="text-4xl">{o.emoji}</span>
                        <div>
                          <div className="font-bold text-xl text-text-primary mb-1">{o.label}</div>
                          <div className="text-sm text-text-secondary">{o.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </WizardStep>
              )}

              {/* ── STEP 6: Results ── */}
              {step === 6 && results && (
                <WizardStep key="step6" direction={direction}>
                  <div className="text-center mb-8">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }} className="text-6xl mb-4">🎉</motion.div>
                    <h1 className="text-3xl font-black text-text-primary mb-2">{t(lang, 'resultsTitle')}</h1>
                    <p className="text-base text-text-secondary">{t(lang, 'resultsHint')}</p>
                  </div>

                  <div className="space-y-6 mb-8">
                    {results.map((r, i) => (
                      <motion.div key={r.crop} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
                        <ResultCard r={r} rank={i + 1} lang={lang} voiceCode={voiceCode} />
                      </motion.div>
                    ))}
                  </div>

                  <div className="p-5 rounded-2xl bg-accent/10 border border-accent/20 text-earth text-sm font-medium mb-8">
                    ⚠️ {t(lang, 'disclaimer')}
                  </div>

                  <BigButton onClick={restart} label={t(lang, 'tryAgain')} variant="outline" />
                </WizardStep>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Sticky Bottom Bar */}
        {step >= 1 && step <= 5 && !loading && (
          <div className="glass-footer">
            <div className="max-w-[720px] mx-auto flex gap-4">
              <button onClick={goBack} className="px-6 py-4 rounded-2xl font-bold text-text-secondary hover:bg-background transition-colors min-h-[56px]">
                {t(lang, 'back')}
              </button>
              <button onClick={goNext} disabled={loading || weatherStatus === 'loading' || (step === 2 && !soilValid)} className="flex-1 btn-primary text-xl">
                {step === 5 ? t(lang, 'seeResults') : t(lang, 'next')} →
              </button>
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

function Shell({ children, lang, setLang, voiceCode }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return false;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div 
      className="min-h-[100dvh] bg-background text-text-primary font-sans relative overflow-hidden"
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
        <header className="glass-header pt-[env(safe-area-inset-top)]">
          <div className="max-w-[720px] mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl drop-shadow-sm">🌱</span>
              <span className="font-bold text-xl text-primary tracking-tight">Crop AI</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsDark(!isDark)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface border border-border shadow-soft text-text-primary hover:border-primary/50 transition-all"
                aria-label="Toggle Dark Mode"
              >
                {isDark ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <select value={lang} onChange={e => setLang(e.target.value)}
                className="rounded-full border border-border px-3 py-2 text-sm font-semibold bg-surface shadow-soft outline-none focus:border-primary">
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.native}</option>)}
              </select>
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

function StepHeader({ lang, voiceCode, titleKey, hintKey }) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-3xl font-bold text-text-primary leading-tight tracking-tight">{t(lang, titleKey)}</h2>
        {speechSupported && (
          <button onClick={() => speak(t(lang, titleKey) + '. ' + t(lang, hintKey), voiceCode)}
            className="flex-shrink-0 w-12 h-12 rounded-full bg-water/10 text-water flex items-center justify-center text-xl hover:bg-water/20 transition-colors shadow-soft" title="Read aloud">
            <motion.span whileTap={{ scale: 0.9 }}>🔊</motion.span>
          </button>
        )}
      </div>
      <p className="text-base text-text-secondary mt-2">{t(lang, hintKey)}</p>
    </div>
  );
}

function BigButton({ onClick, label, variant = 'primary' }) {
  const cls = variant === 'outline'
    ? 'border-2 border-primary text-primary hover:bg-primary/5 bg-transparent'
    : 'bg-primary text-white hover:bg-primary-hover shadow-soft hover:shadow-hoverPop';

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full py-4 rounded-2xl font-bold text-xl transition-all min-h-[60px] ${cls}`}
    >
      {label} {variant === 'primary' && '→'}
    </motion.button>
  );
}

function PathCard({ emoji, label, desc, onClick, recommended }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative w-full p-5 rounded-3xl border-2 border-border bg-surface text-left flex items-center gap-5 hover:border-primary/50 shadow-soft transition-all"
    >
      {recommended && (
        <span className="absolute -top-3 right-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          Recommended
        </span>
      )}
      <div className="text-4xl bg-background p-3 rounded-2xl">{emoji}</div>
      <div>
        <div className="font-bold text-lg text-text-primary">{label}</div>
        {desc && <div className="text-sm text-text-secondary mt-0.5">{desc}</div>}
      </div>
    </motion.button>
  );
}

export function ResultCard({ r, rank, lang, voiceCode }) {
  const scorePercent = Math.round(r.suitability);
  const sc = suitabilityColor(scorePercent);
  const label = t(lang, suitabilityLabel(scorePercent));
  const isTop = rank === 1;

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

  return (
    <div className={`card-surface border-2 transition-all relative overflow-hidden ${isTop ? 'border-primary ring-4 ring-primary/10 shadow-hoverPop' : 'border-border'}`}>

      {isTop && (
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary to-accent" />
      )}

      <div className="p-5 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            {isTop && <div className="text-xs font-black text-accent uppercase tracking-wider mb-1">Top Recommendation</div>}
            <h3 className="text-3xl font-black text-text-primary">{displayCrop}</h3>

            <div className="flex items-center gap-2 mt-2">
              <div className="text-2xl">{sc.emoji}</div>
              <div className="font-bold text-sm" style={{ color: sc.text }}>{label}</div>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <div className="text-sm font-semibold text-text-secondary mb-1">Suitability</div>
            <div className="text-4xl font-black text-primary flex items-baseline gap-1">
              <ScoreCounter value={scorePercent} />
              <span className="text-xl">%</span>
            </div>
          </div>
        </div>

        <div className="h-2 bg-border rounded-full overflow-hidden mt-2">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: sc.bg === '#F9FBE7' ? sc.border : sc.text }}
            initial={{ width: 0 }}
            animate={{ width: `${scorePercent}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        </div>

        <div className="bg-background rounded-2xl p-4 mt-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-base text-text-primary">{t(lang, 'whyThisCrop')}</h4>
            {speechSupported && (
              <button onClick={() => speak(displayCrop + '. ' + whyText, voiceCode)}
                className="w-10 h-10 rounded-full bg-water/10 text-water flex items-center justify-center text-lg hover:bg-water/20">🔊</button>
            )}
          </div>
          <ul className="space-y-2">
            {translatedReasons.slice(0, 3).map((reason, i) => (
              <li key={i} className="text-sm text-text-secondary flex items-start gap-3">
                <span className="text-primary mt-0.5 text-base">✓</span> {reason}
              </li>
            ))}
          </ul>
          {translatedRisks.length > 0 && (
            <div className="mt-4">
              <h4 className="font-bold text-base text-text-primary">{t(lang, 'warnings')}</h4>
              <ul className="mt-2 space-y-2">
                {translatedRisks.map((risk, i) => <li key={i} className="text-sm text-earth">⚠️ {risk}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
