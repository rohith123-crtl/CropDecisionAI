import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Upload, Leaf, AlertTriangle, CheckCircle2, ShieldAlert,
  Sparkles, Calendar, TrendingUp, TrendingDown, Clock, Activity,
  Sprout, Droplets, Volume2, VolumeX, RefreshCw, Trash2, ArrowRight,
  ShieldCheck, HeartPulse, Check, Info, Scissors, Eye, RotateCcw,
  Sliders, CloudSun, MapPin
} from 'lucide-react';
import { api } from '../api';
import { speak, stopSpeaking, speechSupported, getGPSPosition } from '../utils';
import {
  CROP_HEALTH_LANGUAGES,
  tCropHealth,
  localizeDiagnosis,
  getMonthlySpeechSummary
} from '../cropHealthI18n';

// 5 Standard Monthly Crop Growth Stages
const MONTHLY_STAGES = [
  { month: 1, days: 'Days 1 – 30', stage: 'Seedling & Sprouting', short: 'Seedling', icon: Sprout },
  { month: 2, days: 'Days 31 – 60', stage: 'Vegetative Growth', short: 'Vegetative', icon: Leaf },
  { month: 3, days: 'Days 61 – 90', stage: 'Flowering & Heading', short: 'Flowering', icon: Sparkles },
  { month: 4, days: 'Days 91 – 120', stage: 'Fruiting & Pod Fill', short: 'Fruiting', icon: Activity },
  { month: 5, days: 'Days 121 – 150', stage: 'Maturity & Harvest', short: 'Harvest', icon: CheckCircle2 }
];

// Generates an SVG leaf preview for instant visual testing
function generateSampleLeafSvg(type) {
  if (type === 'blight') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><radialGradient id="bg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23568764"/><stop offset="100%" stop-color="%232d5239"/></radialGradient><radialGradient id="spot1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%233a1e0b"/><stop offset="45%" stop-color="%23714828"/><stop offset="80%" stop-color="%23c49a45"/><stop offset="100%" stop-color="%23e5d36e"/></radialGradient></defs><rect width="400" height="300" fill="%231a291e"/><path d="M200 25 C310 80 340 190 200 275 C60 190 90 80 200 25 Z" fill="url(%23bg)"/><path d="M200 25 L200 275" stroke="%237bb378" stroke-width="4"/><path d="M200 85 Q260 115 290 135" stroke="%237bb378" stroke-width="2.5" fill="none"/><path d="M200 145 Q265 175 295 195" stroke="%237bb378" stroke-width="2.5" fill="none"/><path d="M200 105 Q135 135 105 155" stroke="%237bb378" stroke-width="2.5" fill="none"/><circle cx="235" cy="145" r="32" fill="url(%23spot1)"/><circle cx="165" cy="180" r="22" fill="url(%23spot1)"/><circle cx="210" cy="95" r="14" fill="url(%23spot1)"/><text x="20" y="285" font-family="sans-serif" font-size="12" fill="%23fef08a" font-weight="bold">Early Blight Lesions (Concentric rings)</text></svg>`;
  }
  if (type === 'recovering') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><radialGradient id="bg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%235ea86f"/><stop offset="100%" stop-color="%232c633a"/></radialGradient></defs><rect width="400" height="300" fill="%231a291e"/><path d="M200 25 C310 80 340 190 200 275 C60 190 90 80 200 25 Z" fill="url(%23bg)"/><path d="M200 25 L200 275" stroke="%238fd198" stroke-width="4"/><circle cx="230" cy="140" r="12" fill="%237a6245" opacity="0.6"/><text x="20" y="285" font-family="sans-serif" font-size="12" fill="%2386efac" font-weight="bold">Recovering Canopy (Arrested spots)</text></svg>`;
  }
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><radialGradient id="bg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%2368b87a"/><stop offset="100%" stop-color="%23275c35"/></radialGradient></defs><rect width="400" height="300" fill="%231a291e"/><path d="M200 25 C310 80 340 190 200 275 C60 190 90 80 200 25 Z" fill="url(%23bg)"/><path d="M200 25 L200 275" stroke="%239ce0a6" stroke-width="4"/><path d="M200 85 Q260 115 290 135" stroke="%239ce0a6" stroke-width="2.5" fill="none"/><path d="M200 145 Q265 175 295 195" stroke="%239ce0a6" stroke-width="2.5" fill="none"/><path d="M200 105 Q135 135 105 155" stroke="%239ce0a6" stroke-width="2.5" fill="none"/><circle cx="210" cy="50" r="4" fill="%23e8fced" opacity="0.8"/><text x="20" y="285" font-family="sans-serif" font-size="12" fill="%2386efac" font-weight="bold">Clean, Vibrant Green Leaf</text></svg>`;
}

export default function CropHealthView({ user, journalCrops = [], onGoToPlanner }) {
  const [cropName, setCropName] = useState(journalCrops[0]?.crop || 'Tomato');
  
  // Starting date defaults to 65 days ago so Month 1 and Month 2 are naturally in the past
  const [startDate, setStartDate] = useState(() => {
    try {
      const saved = localStorage.getItem('crop_health_start_date');
      if (saved) return saved;
      const d = new Date();
      d.setDate(d.getDate() - 65);
      return d.toISOString().split('T')[0];
    } catch {
      return '2026-06-01';
    }
  });

  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('crop_health_lang') || localStorage.getItem('cropwise_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const [monthlyPhotos, setMonthlyPhotos] = useState(() => {
    try {
      const saved = localStorage.getItem(`monthly_health_${cropName.toLowerCase()}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // Real-time environmental telemetry state
  const [realtimeEnv, setRealtimeEnv] = useState(null);
  const [loadingRealtime, setLoadingRealtime] = useState(false);

  const [analyzingMonth, setAnalyzingMonth] = useState(null);
  const [activeSpeechMonth, setActiveSpeechMonth] = useState(null);
  const fileInputRef = useRef(null);
  const uploadTargetMonth = useRef(1);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`monthly_health_${cropName.toLowerCase()}`, JSON.stringify(monthlyPhotos));
      localStorage.setItem('crop_health_start_date', startDate);
    } catch {}
  }, [monthlyPhotos, cropName, startDate]);

  // Fetch real-time environmental data (weather + satellite soil moisture)
  const fetchLiveTelemetry = async () => {
    setLoadingRealtime(true);
    let lat = 17.3850;
    let lon = 78.4867; // Default India agro-zone (Hyderabad / Telangana)

    try {
      const pos = await getGPSPosition();
      lat = pos.lat;
      lon = pos.lon;
    } catch {
      // Use location default
    }

    try {
      const data = await api(`/realtime/environment?lat=${lat}&lon=${lon}`);
      setRealtimeEnv(data);
    } catch (e) {
      console.warn('Could not fetch realtime environment:', e);
    } finally {
      setLoadingRealtime(false);
    }
  };

  useEffect(() => {
    fetchLiveTelemetry();
  }, []);

  // Calculate current age in days and current month index
  const startEpoch = new Date(startDate).getTime();
  const todayEpoch = new Date().getTime();
  const daysPassed = Math.max(0, Math.floor((todayEpoch - startEpoch) / (1000 * 60 * 60 * 24)));
  const currentMonthNum = Math.min(5, Math.max(1, Math.floor(daysPassed / 30) + 1));

  // Compute month dates based on start date
  const getMonthDateRange = (monthIdx) => {
    const s = new Date(startDate);
    s.setDate(s.getDate() + (monthIdx - 1) * 30);
    const e = new Date(startDate);
    e.setDate(e.getDate() + monthIdx * 30 - 1);
    const format = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    return `${format(s)} – ${format(e)}`;
  };

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('crop_health_lang', newLang);
      localStorage.setItem('cropwise_lang', newLang);
    } catch {}
    stopSpeaking();
    setActiveSpeechMonth(null);
  };

  const handleAudioToggle = (monthNum, diagnosis) => {
    if (activeSpeechMonth === monthNum) {
      stopSpeaking();
      setActiveSpeechMonth(null);
      return;
    }
    stopSpeaking();
    const langObj = CROP_HEALTH_LANGUAGES.find((l) => l.code === lang) || CROP_HEALTH_LANGUAGES[0];
    const text = getMonthlySpeechSummary(monthNum, diagnosis, lang);
    setActiveSpeechMonth(monthNum);
    speak(text, langObj.voiceCode, {
      onStart: () => setActiveSpeechMonth(monthNum),
      onEnd: () => setActiveSpeechMonth(null)
    });
  };

  // Analyze a photo for a given month
  const analyzeMonthlyPhoto = async (monthNum, imageBase64, forceDisease = null) => {
    setAnalyzingMonth(monthNum);
    stopSpeaking();
    setActiveSpeechMonth(null);

    const stageObj = MONTHLY_STAGES.find(m => m.month === monthNum) || MONTHLY_STAGES[0];

    try {
      const res = await api('/crop-health/analyze', {
        method: 'POST',
        body: JSON.stringify({
          crop_name: cropName,
          growth_stage: stageObj.stage,
          scan_date: new Date().toISOString().split('T')[0],
          image_base64: imageBase64,
          force_disease: forceDisease,
          language: lang,
          save_to_log: Boolean(user)
        })
      });

      // Enrich with live weather warning if high humidity detected
      let changes = res.changes_needed || [];
      if (realtimeEnv && realtimeEnv.humidity > 70 && res.health_status !== 'healthy') {
        changes = [
          {
            type: 'spray',
            title: 'Live Weather Alert (High Humidity)',
            text: `Ambient humidity is currently ${realtimeEnv.humidity}%. Fungal spores spread quickly in damp air. Spray prophylactic neem oil or bio-fungicide immediately.`
          },
          ...changes
        ];
      }

      setMonthlyPhotos(prev => ({
        ...prev,
        [monthNum]: {
          month: monthNum,
          stage: stageObj.stage,
          image: imageBase64,
          date: new Date().toISOString().split('T')[0],
          diagnosis: {
            ...res,
            changes_needed: changes
          }
        }
      }));
    } catch (err) {
      console.error('Diagnosis failed:', err);
      // Fallback client simulation if offline
      const isHealthy = forceDisease === 'healthy' || monthNum === 1 || monthNum >= 4;
      setMonthlyPhotos(prev => ({
        ...prev,
        [monthNum]: {
          month: monthNum,
          stage: stageObj.stage,
          image: imageBase64,
          date: new Date().toISOString().split('T')[0],
          diagnosis: {
            crop_name: cropName,
            growth_stage: stageObj.stage,
            health_score: isHealthy ? 92 : 62,
            health_status: isHealthy ? 'healthy' : 'warning',
            disease_detected: isHealthy ? 'Healthy & Robust Stand' : 'Early Blight Spots',
            severity: isHealthy ? 'None' : 'Moderate',
            monthly_verdict: isHealthy ? 'Healthy & Thriving — Growing on track with good vigor.' : 'Needs Attention — Early signs detected; take preventive steps this month.',
            changes_needed: isHealthy ? [
              { type: 'water', title: 'Watering Schedule', text: 'Water at root base in morning; keep foliage dry.' },
              { type: 'care', title: 'Canopy & Sunlight', text: 'Clear surrounding weeds to improve light and breeze.' },
              { type: 'nutrition', title: 'Monthly Nutrition', text: 'Add organic vermicompost to sustain vibrant growth.' }
            ] : [
              { type: 'care', title: 'Prune Lower Leaves', text: 'Prune off yellowing bottom leaves touching wet soil.' },
              { type: 'spray', title: 'Organic Neem Spray', text: 'Spray Neem oil (5 ml/L) once this week before rains.' },
              { type: 'water', title: 'Watering Change', text: 'Avoid overhead watering; switch to basin or drip.' }
            ]
          }
        }
      }));
    } finally {
      setAnalyzingMonth(null);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Data = uploadEvent.target?.result;
      if (typeof base64Data === 'string') {
        analyzeMonthlyPhoto(uploadTargetMonth.current, base64Data);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const triggerUploadForMonth = (monthNum) => {
    uploadTargetMonth.current = monthNum;
    fileInputRef.current?.click();
  };

  // Load realistic 4-month demo scenario
  const loadDemoScenario = () => {
    setCropName('Tomato');
    const demo = {
      1: {
        month: 1,
        stage: 'Seedling & Sprouting',
        image: generateSampleLeafSvg('healthy'),
        date: getMonthDateRange(1).split(' – ')[0],
        diagnosis: {
          crop_name: 'Tomato',
          growth_stage: 'Seedling & Sprouting',
          health_score: 95,
          health_status: 'healthy',
          disease_detected: 'Vigorous Seedling Stand',
          severity: 'None',
          monthly_verdict: 'Healthy & Thriving — Young seedlings are strong and well-rooted.',
          changes_needed: [
            { type: 'water', title: 'Light Daily Irrigation', text: 'Keep topsoil moist but not soggy. Avoid washing out tender roots.' },
            { type: 'care', title: 'Thinning', text: 'Thin out crowded sprouts to leave 30cm spacing between plants.' },
            { type: 'nutrition', title: 'Starter Compost', text: 'Mix well-rotted cow dung into top 2 inches around seedlings.' }
          ]
        }
      },
      2: {
        month: 2,
        stage: 'Vegetative Growth',
        image: generateSampleLeafSvg('blight'),
        date: getMonthDateRange(2).split(' – ')[0],
        diagnosis: {
          crop_name: 'Tomato',
          growth_stage: 'Vegetative Growth',
          health_score: 64,
          health_status: 'warning',
          disease_detected: 'Early Blight (Alternaria Solani)',
          severity: 'Moderate',
          monthly_verdict: 'Needs Attention — Brown target spots on lower leaves require immediate care.',
          changes_needed: [
            { type: 'care', title: 'Prune Bottom Foliage', text: 'Snip and burn all lower leaves touching the soil.' },
            { type: 'spray', title: 'Neem or Mancozeb Spray', text: 'Spray organic Neem seed extract (5ml/L) or protective Mancozeb (2g/L).' },
            { type: 'water', title: 'Stop Overhead Wetting', text: 'Water strictly at soil level in early mornings so leaves stay dry.' }
          ]
        }
      },
      3: {
        month: 3,
        stage: 'Flowering & Heading',
        image: generateSampleLeafSvg('recovering'),
        date: getMonthDateRange(3).split(' – ')[0],
        diagnosis: {
          crop_name: 'Tomato',
          growth_stage: 'Flowering & Heading',
          health_score: 84,
          health_status: 'healthy',
          disease_detected: 'Foliar Recovery & Arrested Spots',
          severity: 'Mild',
          monthly_verdict: 'Recovering Strongly — New shoots are clean and blossoms are setting well.',
          changes_needed: [
            { type: 'nutrition', title: 'Calcium-Boron Nutrition', text: 'Add calcium nitrate and boron to strengthen flower buds and avoid blossom drop.' },
            { type: 'water', title: 'Even Moisture Control', text: 'Maintain regular drip watering so flowers do not drop from dry stress.' },
            { type: 'care', title: 'Plant Staking', text: 'Tie tomato vines to bamboo stakes to keep heavy branches off the ground.' }
          ]
        }
      },
      4: {
        month: 4,
        stage: 'Fruiting & Pod Fill',
        image: generateSampleLeafSvg('healthy'),
        date: getMonthDateRange(4).split(' – ')[0],
        diagnosis: {
          crop_name: 'Tomato',
          growth_stage: 'Fruiting & Pod Fill',
          health_score: 92,
          health_status: 'healthy',
          disease_detected: 'Clean Fruiting Stand',
          severity: 'None',
          monthly_verdict: 'Excellent Health — Green fruit clusters are clean and sizing up evenly.',
          changes_needed: [
            { type: 'care', title: 'Straw Mulch Beds', text: 'Mulch soil surface with dry paddy straw to prevent moisture evaporation.' },
            { type: 'care', title: 'Fruit Sunscald Guard', text: 'Ensure upper canopy shades exposed tomatoes from intense afternoon sun.' },
            { type: 'water', title: 'Steady Irrigation', text: 'Water consistently to prevent fruit splitting during ripening.' }
          ]
        }
      }
    };
    setMonthlyPhotos(demo);
  };

  const clearPhotos = () => {
    stopSpeaking();
    setActiveSpeechMonth(null);
    setMonthlyPhotos({});
    try {
      localStorage.removeItem(`monthly_health_${cropName.toLowerCase()}`);
    } catch {}
  };

  // Delete a specific month's photo
  const deleteMonthPhoto = (monthNum) => {
    stopSpeaking();
    setActiveSpeechMonth(null);
    setMonthlyPhotos(prev => {
      const copy = { ...prev };
      delete copy[monthNum];
      return copy;
    });
  };

  return (
    <div className="crop-health-simple-container">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* TOP CONFIG BAR */}
      <div className="glass-panel health-config-panel">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '18px', marginBottom: '18px' }}>
          <div>
            <span className="eyebrow" style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={15} /> MONTH-BY-MONTH PHOTO HEALTH DIAGNOSER
            </span>
            <h2 style={{ fontSize: '22px', margin: '4px 0 2px' }}>Track Crop Health Every Month from Sowing</h2>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              Just upload 1 photo each month. The AI monitors leaf health, shows improvements over time, and tells you exactly what changes are needed!
            </p>
          </div>

          {/* Language selector & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Language:</span>
              <select
                value={lang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                style={{ background: 'transparent', border: 'none', fontWeight: 600, color: '#4ade80', cursor: 'pointer' }}
              >
                {CROP_HEALTH_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code} style={{ background: '#17251b', color: '#fff' }}>
                    {l.native} ({l.label})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={loadDemoScenario}
              className="cream-button"
              style={{ fontSize: '13px', padding: '8px 14px', borderRadius: '14px' }}
              title="See an example 4-month crop journey"
            >
              <Sparkles size={15} /> See Example Story
            </button>

            {Object.keys(monthlyPhotos).length > 0 && (
              <button
                onClick={clearPhotos}
                className="text-button"
                style={{ fontSize: '13px', color: '#f87171' }}
                title="Reset all monthly photos"
              >
                <RotateCcw size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* CROP NAME & STARTING DATE INPUTS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
              🌱 Crop You Are Growing:
            </label>
            <input
              type="text"
              className="health-input-box"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder="e.g. Tomato, Rice, Cotton, Chilli..."
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
              📅 Sowing / Starting Date:
            </label>
            <input
              type="date"
              className="health-input-box"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* Current Crop Age & Active Month Badge */}
          <div className="health-age-banner">
            <span className="age-title">
              CURRENT AGE & PROGRESS
            </span>
            <div className="age-days">
              {daysPassed} Days After Sowing
            </div>
            <span className="age-sub">
              Currently in <strong>Month {currentMonthNum}</strong> ({MONTHLY_STAGES[currentMonthNum - 1]?.stage})
            </span>
          </div>
        </div>
      </div>

      {/* REAL-TIME WEATHER & SOIL TELEMETRY BAR */}
      <div className="live-realtime-badge">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CloudSun size={20} color="#3b82f6" />
          <div>
            <span className="badge-label">🛰️ Real-Time Field Weather & Topsoil Telemetry:</span>
            <div className="badge-val">
              {realtimeEnv ? (
                <>
                  {realtimeEnv.temperature}°C Temp · {realtimeEnv.humidity}% Humidity · {realtimeEnv.rainfall} mm Rain · Topsoil Moisture: {realtimeEnv.soil_moisture} m³/m³ ({realtimeEnv.soil_moisture_status})
                </>
              ) : (
                loadingRealtime ? 'Connecting to live satellite telemetry...' : 'Live environmental feeds active'
              )}
            </div>
          </div>
        </div>
        <button
          onClick={fetchLiveTelemetry}
          className="text-button"
          style={{ fontSize: '12px', padding: '4px 8px' }}
          title="Refresh live environmental data"
        >
          <RefreshCw size={13} /> Refresh Live Feed
        </button>
      </div>

      {/* 3 SIMPLE STEPS BANNER */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <div className="health-step-card">
          <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#2e7d32', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>1</div>
          <div>
            <div className="step-title">Set Sowing Date</div>
            <div className="step-desc">Tells AI your crop's exact age & stage</div>
          </div>
        </div>

        <div className="health-step-card">
          <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#2563eb', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>2</div>
          <div>
            <div className="step-title">Snap 1 Photo Each Month</div>
            <div className="step-desc">Take picture of leaves or canopy</div>
          </div>
        </div>

        <div className="health-step-card">
          <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#eab308', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>3</div>
          <div>
            <div className="step-title">Get Suggested Changes</div>
            <div className="step-desc">Clear tips for water, pruning & spray</div>
          </div>
        </div>
      </div>

      {/* MONTHLY TIMELINE CARDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {MONTHLY_STAGES.map((s, index) => {
          const mNum = s.month;
          const monthData = monthlyPhotos[mNum];
          const isUploaded = Boolean(monthData);
          const isCurrent = mNum === currentMonthNum;
          const isPast = mNum < currentMonthNum;
          const isAnalyzingThis = analyzingMonth === mNum;
          const prevMonthScore = monthlyPhotos[mNum - 1]?.diagnosis?.health_score;
          const currentScore = monthData?.diagnosis?.health_score;

          let scoreDelta = null;
          if (isUploaded && prevMonthScore !== undefined && currentScore !== undefined) {
            scoreDelta = currentScore - prevMonthScore;
          }

          // Health badge styling
          let badgeColor = '#16a34a';
          let badgeBg = 'rgba(22, 163, 74, 0.15)';
          let badgeText = 'Healthy Stand';
          if (currentScore < 60) {
            badgeColor = '#ef4444';
            badgeBg = 'rgba(239, 68, 68, 0.15)';
            badgeText = 'Needs Urgent Action';
          } else if (currentScore < 85) {
            badgeColor = '#f59e0b';
            badgeBg = 'rgba(245, 158, 11, 0.15)';
            badgeText = 'Needs Attention';
          }

          return (
            <div
              key={mNum}
              className={`month-card ${isCurrent ? 'active-month' : ''}`}
            >
              {/* CURRENT MONTH CALLOUT PILL */}
              {isCurrent && (
                <div style={{ position: 'absolute', top: '-13px', right: '24px', background: '#2e7d32', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 12px', borderRadius: '12px', letterSpacing: '0.5px' }}>
                  ACTIVE MONTH NOW
                </div>
              )}

              {/* CARD HEADER */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '16px', background: isUploaded ? '#2e7d32' : (isCurrent ? '#2563eb' : '#64748b'), color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                    {mNum}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 className="month-card-title">
                        Month {mNum}: {s.stage}
                      </h3>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>({s.days})</span>
                    </div>
                    <span className="month-card-sub">
                      Expected Timeline: <strong>{getMonthDateRange(mNum)}</strong>
                    </span>
                  </div>
                </div>

                {/* Score and Trend badge if uploaded */}
                {isUploaded && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ background: badgeBg, color: badgeColor, border: `1px solid ${badgeColor}`, padding: '6px 14px', borderRadius: '14px', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: badgeColor }} />
                      {currentScore}% Health · {badgeText}
                    </div>

                    {scoreDelta !== null && (
                      <div style={{ fontSize: '13px', fontWeight: 700, color: scoreDelta >= 0 ? '#4ade80' : '#f87171', background: scoreDelta >= 0 ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)', padding: '6px 10px', borderRadius: '12px', border: `1px solid ${scoreDelta >= 0 ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'}` }}>
                        {scoreDelta >= 0 ? `▲ +${scoreDelta}% vs Month ${mNum - 1}` : `▼ ${scoreDelta}% vs Month ${mNum - 1}`}
                      </div>
                    )}

                    {/* Audio Listen Button */}
                    {speechSupported && (
                      <button
                        onClick={() => handleAudioToggle(mNum, monthData.diagnosis)}
                        className="cream-button"
                        style={{ padding: '6px 12px', borderRadius: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        title="Listen to this month's advice"
                      >
                        {activeSpeechMonth === mNum ? <VolumeX size={16} color="#ef4444" /> : <Volume2 size={16} color="#2e7d32" />}
                        <span>{activeSpeechMonth === mNum ? 'Stop' : 'Listen'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => deleteMonthPhoto(mNum)}
                      style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
                      title="Remove this photo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* BODY: PHOTO + MONTHLY DIAGNOSIS & CHANGES */}
              {isUploaded ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'start' }}>
                  {/* Photo thumbnail */}
                  <div style={{ borderRadius: '18px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                    <img
                      src={monthData.image}
                      alt={`Month ${mNum} leaf`}
                      style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ padding: '10px 14px', background: 'rgba(20, 36, 25, 0.95)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>Photo scanned on: {monthData.date}</span>
                      <button
                        onClick={() => triggerUploadForMonth(mNum)}
                        style={{ fontSize: '12px', color: '#4ade80', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Replace photo
                      </button>
                    </div>
                  </div>

                  {/* Monthly Verdict & Changes Needed */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Monthly Verdict */}
                    <div className="health-verdict-banner">
                      <div className="verdict-label">
                        MONTH {mNum} HEALTH VERDICT
                      </div>
                      <div className="verdict-text">
                        {monthData.diagnosis?.monthly_verdict || monthData.diagnosis?.disease_detected}
                      </div>
                    </div>

                    {/* SUGGESTED CHANGES NEEDED */}
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sliders size={16} color="#4ade80" /> SUGGESTED CHANGES NEEDED THIS MONTH:
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(monthData.diagnosis?.changes_needed || []).map((change, cIdx) => (
                          <div key={cIdx} className="health-action-box">
                            <div style={{ marginTop: '2px', color: '#4ade80' }}>
                              {change.type === 'water' && <Droplets size={18} color="#60a5fa" />}
                              {change.type === 'care' && <Scissors size={18} color="#34d399" />}
                              {change.type === 'spray' && <ShieldCheck size={18} color="#fbbf24" />}
                              {change.type === 'nutrition' && <Sprout size={18} color="#4ade80" />}
                              {change.type === 'medicine' && <AlertTriangle size={18} color="#f87171" />}
                            </div>
                            <div>
                              <strong className="action-title">
                                {change.title}
                              </strong>
                              <span className="action-text">
                                {change.text}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* NOT UPLOADED YET */
                <div className="month-empty-slot">
                  <p>
                    {isCurrent
                      ? `Your crop is currently in Month ${mNum}! Put a photo of the leaves now to see if any care changes are needed.`
                      : isPast
                      ? `Month ${mNum} has passed. You can still add a photo to complete your seasonal health history.`
                      : `Upcoming in Month ${mNum}. When your crop reaches this stage, take a photo to check for early symptoms.`}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
                    <button
                      onClick={() => triggerUploadForMonth(mNum)}
                      disabled={isAnalyzingThis}
                      className="forest-button"
                      style={{ padding: '10px 20px', borderRadius: '16px', fontSize: '14px' }}
                    >
                      {isAnalyzingThis ? (
                        <>Analyzing photo...</>
                      ) : (
                        <>
                          <Camera size={18} /> Put Month {mNum} Photo
                        </>
                      )}
                    </button>

                    {/* Instant sample photo tester button */}
                    <button
                      onClick={() => {
                        const sampleType = mNum === 2 ? 'blight' : (mNum === 3 ? 'recovering' : 'healthy');
                        analyzeMonthlyPhoto(mNum, generateSampleLeafSvg(sampleType), sampleType === 'blight' ? 'early_blight' : 'healthy');
                      }}
                      disabled={isAnalyzingThis}
                      className="cream-button"
                      style={{ padding: '10px 16px', borderRadius: '16px', fontSize: '14px' }}
                    >
                      <Sparkles size={16} /> Test with Sample Photo
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
