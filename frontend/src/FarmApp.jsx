import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Sprout, Leaf, LayoutDashboard, BookOpen, History, UserRound, LogOut, Plus, MapPin, Pencil, Sun, X, Check, Trash2, ChevronRight, ShieldCheck } from 'lucide-react';
import Wizard, { ResultCard } from './App';
import { api } from './api';

const nav = [['overview', LayoutDashboard, 'Overview'], ['planner', Sprout, 'Crop planner'], ['history', History, 'Recommendation history'], ['journal', BookOpen, 'Crop journal'], ['profile', UserRound, 'My profile']];
const enter = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: .28 } };

function GoogleButton({ onLogin }) {
  const host = useRef(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    let timer;
    api('/auth/config').then(async config => {
      if (!active) return;
      if (!config.client_id) { setError('Google sign-in will be available once the app owner finishes setup. You can explore the crop planner now.'); return; }
      if (!window.google?.accounts) await new Promise((resolve, reject) => {
        let script = document.querySelector('script[data-google-login]');
        if (!script) {
          script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client'; script.async = true; script.dataset.googleLogin = 'true';
          document.head.appendChild(script);
        }
        script.addEventListener('load', resolve, { once: true });
        script.addEventListener('error', () => { script.remove(); reject(new Error('Google could not load. Please reopen sign-in to retry.')); }, { once: true });
        timer = setTimeout(() => reject(new Error('Google is taking too long to load. Please try again.')), 12000);
      });
      if (!active) return;
      window.google.accounts.id.initialize({ client_id: config.client_id, nonce: config.nonce, auto_select: false,
        callback: async ({ credential }) => {
          setBusy(true); setError('');
          try { const user = await api('/auth/google', { method: 'POST', body: JSON.stringify({ credential }) }); if (active) onLogin(user); }
          catch (e) { if (active) setError(e.message); }
          finally { if (active) setBusy(false); }
        },
      });
      window.google.accounts.id.renderButton(host.current, { theme: 'outline', size: 'large', shape: 'pill', width: 280, text: 'continue_with' });
    }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; clearTimeout(timer); };
  }, []);
  return <><div ref={host} className="google-host" />{busy && <p role="status">Signing you in…</p>}{error && <p role="status" className="muted small">{error}</p>}</>;
}

function Modal({ children, close }) {
  const dialog = useRef(null);
  useEffect(() => { dialog.current.showModal(); return () => dialog.current?.close(); }, []);
  return <dialog ref={dialog} className="nature-modal" onCancel={close} onClick={e => { if (e.target === dialog.current) close(); }}><button className="icon-button modal-close" aria-label="Close dialog" onClick={close}><X size={20}/></button>{children}</dialog>;
}

export default function FarmApp() {
  const [page, setPage] = useState('overview');
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [journal, setJournal] = useState([]);
  const [error, setError] = useState('');
  const [signIn, setSignIn] = useState(false);
  const [selected, setSelected] = useState(null);
  const [recordOpen, setRecordOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState('');
  const generation = useRef(0);
  const refresh = async () => {
    const current = ++generation.current;
    setError(''); setLoaded(false);
    try {
      const [h, j] = await Promise.all([api('/history'), api('/journal')]);
      if (current === generation.current) { setHistory(h); setJournal(j); setLoaded(true); }
    } catch (e) { if (current === generation.current) setError(e.message); }
  };
  useEffect(() => { api('/me').then(setUser).catch(e => { if (e.status !== 401) setError('The farm service is unavailable. You can explore the app and retry later.'); }); }, []);
  useEffect(() => { if (user) refresh(); else { ++generation.current; setHistory([]); setJournal([]); setLoaded(false); } }, [user?.id]);
  const navigate = next => { setPage(next); setNotice(''); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const logout = async () => {
    setBusy(true);
    try { await api('/auth/logout', { method: 'POST' }); window.google?.accounts.id.disableAutoSelect(); setUser(null); setPage('overview'); setSelected(null); }
    catch(e) { setError(e.message); } finally { setBusy(false); }
  };
  const authenticated = content => user ? content : <div className="glass-panel empty-state"><ShieldCheck size={40}/><h2>A little space for your farm.</h2><p>Sign in to keep your farm profile, crop journal, and recommendations together, wherever you are.</p><button className="forest-button" onClick={() => setSignIn(true)}>Sign in with Google <ArrowRight size={18}/></button></div>;
  return <MotionConfig reducedMotion="user"><div className="nature-app">
    <div className="ambient ambient-one"/><div className="ambient ambient-two"/><div className="grain"/>
    <aside className="farm-sidebar">
      <a href="#" className="brand" onClick={e => { e.preventDefault(); navigate('overview'); }}><span className="brand-mark"><Sprout/></span><span>crop<span className="brand-light">wise</span><small>ROOTED IN POSSIBILITY</small></span></a>
      <div className="sidebar-label">YOUR GROWING SPACE</div>
      <nav aria-label="Main navigation">{nav.map(([id, Icon, label]) => <button key={id} className={`nav-item ${page === id ? 'active' : ''}`} aria-current={page === id ? 'page' : undefined} onClick={() => navigate(id)}><Icon size={19}/><span>{label}</span>{page === id && <span className="nav-dot"/>}</button>)}</nav>
      <div className="sidebar-note"><Leaf size={25}/><h3>Good things take growing.</h3><p>A little knowledge.<br/>A healthier harvest.</p><span>GROW WITH INTENTION ↗</span></div>
      <button className="sidebar-user" onClick={() => user ? navigate('profile') : setSignIn(true)}><Avatar user={user}/><span><strong>{user?.name || 'Your farm, your story'}</strong><small>{user ? 'View your profile' : 'Sign in to make it yours'}</small></span><ChevronRight size={16}/></button>
    </aside>
    <main className="farm-main">
      <header className="farm-topbar"><div className="breadcrumb">Your workspace <span>/</span> <strong>{nav.find(n => n[0] === page)?.[2]}</strong></div><div className="topbar-actions"><span className="nature-pill"><span/> A little closer to nature</span><button className="avatar-button" aria-label={user ? 'Open profile' : 'Sign in'} onClick={() => user ? navigate('profile') : setSignIn(true)}><Avatar user={user}/></button></div></header>
      {error && <div className="status-message error" role="alert">{error}<button onClick={() => user ? refresh() : window.location.reload()}>Retry</button></div>}
      {notice && <div className="status-message" role="status"><Check size={17}/>{notice}</div>}
      <AnimatePresence mode="wait"><motion.div key={page} {...enter}>
      {page === 'overview' && <>
        <div className="page-heading"><div><div className="eyebrow">A FRESH PERSPECTIVE ON FARMING</div><h1>{user ? `Welcome back, ${user.name.split(' ')[0]}.` : 'Let your next season flourish.'}</h1><p>Thoughtful choices today. A thriving farm tomorrow.</p></div><span className="date-label">{new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date())}</span></div>
        <section className="hero-garden"><div className="hero-copy"><span className="hero-label"><Leaf size={15}/> GROWN FROM BETTER DECISIONS</span><h2>In tune with your land.<br/><em>Ready for what’s next.</em></h2><p>Find crops that belong in your soil, suit your water, and support your goals. Your next chapter starts with a seed.</p><button className="cream-button" onClick={() => navigate('planner')}>Find my next crop <ArrowUpRight size={19}/></button><div className="hero-footnote"><span className="tiny-sun"/> Made for your soil. Guided by your goals.</div></div><Botanical/><div className="plant-tag"><span className="plant-tag-icon"><Sprout size={23}/></span><span>Small steps.<br/><strong>Stronger roots.</strong></span></div></section>
        <div className="stat-grid"><Stat icon={MapPin} label="YOUR LAND" value={user ? `${user.farm_area} acres` : 'Your plot awaits'} detail={user?.location || 'Every field has a story'}/><Stat icon={Sprout} label="CROP JOURNAL" value={user && loaded ? `${journal.filter(c => c.status === 'growing').length} growing` : 'Room to grow'} detail={user && loaded ? `${journal.length} crop records in your journal` : 'Keep every season close'}/><Stat icon={History} label="SAVED INSIGHTS" value={user && loaded ? `${history.length} recommendations` : 'A fresh beginning'} detail="Better decisions, season after season"/></div>
        <div className="overview-bottom"><section className="glass-panel"><div className="section-heading"><div><div className="eyebrow">YOUR FIELD NOTES</div><h2>Recent recommendations</h2></div><button className="text-button" onClick={() => navigate('history')}>View all <ArrowUpRight size={16}/></button></div>{user && history.length ? history.slice(0,3).map(h => <HistoryRow key={h.id} record={h} open={() => setSelected(h)}/>) : <div className="gentle-empty"><span className="empty-leaf"><Sprout size={30}/></span><h3>Your next season starts here.</h3><p>Run your first crop plan to turn your farm’s details into useful insights.</p><button className="text-button" onClick={() => navigate('planner')}>Create a crop plan <ArrowRight size={17}/></button></div>}</section><section className="season-card"><span className="eyebrow">A MINDFUL MOMENT</span><Sun size={36} strokeWidth={1}/><h2>Know your soil.<br/>Nurture your future.</h2><p>Your soil is the foundation of every harvest. Add your soil health card values for a more personal crop plan.</p><button className="text-button" onClick={() => navigate('planner')}>Explore your possibilities <ArrowUpRight size={16}/></button></section></div>
      </>}
      {page === 'planner' && <><PageTitle eyebrow="PLANT WITH PURPOSE" title="Your next crop, thoughtfully chosen." text="A few details about your farm. A clearer view of what could grow."/>{!user && <div className="status-message">Exploring as a guest. <button onClick={() => setSignIn(true)}>Sign in to save future recommendations</button></div>}<div className="planner-container glass-panel"><Wizard key={user?.id || 'guest'} profile={user} onSaved={() => { if (user) refresh(); }}/></div></>}
      {page === 'history' && <><PageTitle eyebrow="INSIGHTS THROUGH THE SEASONS" title="Your recommendation history." text="Every crop plan, with the farm details and recommendations behind it."/>{authenticated(<section className="glass-panel">{!loaded ? <p role="status">Loading your recommendations…</p> : history.length ? history.map(h => <HistoryRow key={h.id} record={h} open={() => setSelected(h)}/>) : <Empty title="A blank page. Endless possibilities." text="Your crop recommendations will be saved here automatically." action={() => navigate('planner')} label="Create a crop plan"/>}</section>)}</>}
      {page === 'journal' && <><PageTitle eyebrow="FROM SEED TO SEASON" title="Your crop journal." text="Keep a simple record of what you plant, nurture, and harvest." action={user && <button className="forest-button" onClick={() => { setEditing(null); setRecordOpen(true); }}><Plus size={18}/> Add a crop</button>}/>{authenticated(<section className="journal-grid">{!loaded ? <p role="status">Loading your journal…</p> : journal.length ? journal.map(c => <article key={c.id} className="glass-panel crop-entry"><div className="section-heading"><span className={`crop-status ${c.status}`}>{c.status}</span><button className="icon-button" aria-label={`Edit ${c.crop} record`} onClick={() => { setEditing(c); setRecordOpen(true); }}><Pencil size={16}/></button><button className="icon-button" aria-label={`Delete ${c.crop} record`} onClick={async () => { if (!window.confirm(`Delete this ${c.crop} record?`)) return; try { await api(`/journal/${c.id}`, { method: 'DELETE' }); await refresh(); } catch(e) { setError(e.message); } }}><Trash2 size={16}/></button></div><Sprout className="crop-sprout" size={40}/><h2>{c.crop}</h2><p>{c.area} acres · {c.planted_on}</p>{c.notes && <p className="crop-notes">{c.notes}</p>}</article>) : <div className="glass-panel full-width"><Empty title="Every harvest has a beginning." text="Add your first crop to start a record of your farm’s journey." action={() => { setEditing(null); setRecordOpen(true); }} label="Add your first crop"/></div>}</section>)}</>}
      {page === 'profile' && <><PageTitle eyebrow="THE PERSON BEHIND THE HARVEST" title="A space that’s yours." text="Your details help make your next crop plan feel a little more personal."/>{authenticated(<Profile user={user} busy={busy} logout={logout} onSave={u => { setUser(u); setNotice('Your profile has been saved.'); }}/>)}</>}
      </motion.div></AnimatePresence>
      <footer className="farm-footer"><span><Sprout size={15}/> A little science. A lot of nature.</span><span>Demo guidance · Grow with local expertise</span></footer>
    </main>
    {signIn && <Modal close={() => setSignIn(false)}><div className="signin-content"><span className="brand-mark large"><Sprout size={32}/></span><div className="eyebrow">WELCOME TO CROPWISE</div><h2>Your farm.<br/><em>Your growing story.</em></h2><p>Save your crop plans, build your farm profile, and keep every season in one place.</p><GoogleButton onLogin={u => { setUser(u); setSignIn(false); setError(''); }}/><p className="privacy-note"><ShieldCheck size={16}/> Your profile and farm records are saved to your account. Google is used only to sign you in.</p></div></Modal>}
    {selected && <Modal close={() => setSelected(null)}><div className="history-detail"><div className="eyebrow">SAVED CROP PLAN</div><h2>{selected.farm.location || 'Your farm'}</h2><p>{new Date(selected.created_at * 1000).toLocaleDateString()} · {selected.farm.farm_area} acres · {selected.farm.season}</p><details><summary>View farm inputs</summary><dl className="input-grid">{Object.entries(selected.farm).map(([key,value]) => <div key={key}><dt>{key.replaceAll('_',' ')}</dt><dd>{String(value ?? '—')}</dd></div>)}</dl></details><div className="space-y-4">{selected.result.recommendations.map((r,i) => <ResultCard key={r.crop} r={r} rank={i+1} lang="en" voiceCode="en-IN"/>)}</div><p className="small muted">{selected.result.disclaimer}</p></div></Modal>}
    {recordOpen && <Modal close={() => setRecordOpen(false)}><CropForm initial={editing} area={user?.farm_area || 2} onSave={async body => { await api(editing ? `/journal/${editing.id}` : '/journal', { method: editing ? 'PATCH' : 'POST', body: JSON.stringify(body) }); setRecordOpen(false); await refresh(); }}/></Modal>}
  </div></MotionConfig>;
}
function Avatar({ user }) { return <span className="avatar">{user?.name?.slice(0,1).toUpperCase() || <UserRound size={19}/>}</span>; }
function PageTitle({ eyebrow, title, text, action }) { return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{text}</p></div>{action}</div>; }
function Stat({ icon: Icon, label, value, detail }) { return <div className="glass-panel stat-card"><span className="stat-icon"><Icon size={21}/></span><div><div className="eyebrow">{label}</div><h3>{value}</h3><p>{detail}</p></div></div>; }
function Empty({ title, text, action, label }) { return <div className="gentle-empty"><span className="empty-leaf"><Leaf size={32}/></span><h2>{title}</h2><p>{text}</p><button className="forest-button" onClick={action}>{label}<ArrowRight size={17}/></button></div>; }
function HistoryRow({ record, open }) { return <button className="history-row" onClick={open}><span className="history-icon"><Sprout size={21}/></span><span><strong>{record.result.recommendations[0]?.crop || 'Crop plan'} <small>+ alternatives</small></strong><span>{record.farm.location} · {record.farm.farm_area} acres · {new Date(record.created_at*1000).toLocaleDateString()}</span></span><ArrowUpRight size={19}/></button>; }
function Profile({ user, onSave, logout, busy }) {
  const [form, setForm] = useState(user || {}); const [saving,setSaving] = useState(false); const [error,setError] = useState('');
  if (!user) return null;
  const submit = async e => { e.preventDefault(); setSaving(true); setError(''); try { onSave(await api('/me', { method: 'PATCH', body: JSON.stringify(form) })); } catch(e) { setError(e.message); } finally { setSaving(false); } };
  return <div className="profile-grid"><section className="glass-panel profile-card"><Avatar user={user}/><h2>{user.name}</h2><p className="small muted">{user.email}</p><span className="verified"><ShieldCheck size={15}/> Connected with Google</span><div className="profile-divider"/><Leaf size={30}/><h3>{user.farm_name || 'Your growing space'}</h3><p>{user.location || 'Add your farm location'}</p><button className="text-button" disabled={busy} onClick={logout}><LogOut size={17}/> Sign out</button></section><form className="glass-panel profile-form" onSubmit={submit}><h2>The roots of your profile</h2><p className="muted">A few details about you and the land you care for.</p><div className="form-grid">{[['name','Your name'],['farm_name','Farm name'],['location','Village / district'],['farm_area','Farm area (acres)']].map(([key,label]) => <label key={key}>{label}<input required={key==='name'||key==='farm_area'} maxLength={key==='location'?200:100} type={key==='farm_area'?'number':'text'} min="0.5" max="25" step="0.5" value={form[key]??''} onChange={e=>setForm({...form,[key]:key==='farm_area'?e.target.valueAsNumber:e.target.value})}/></label>)}</div><label>Your farming story<textarea maxLength={1000} rows={4} value={form.bio||''} onChange={e=>setForm({...form,bio:e.target.value})} placeholder="What do you love growing?"/></label>{error && <p role="alert" className="form-error">{error}</p>}<button className="forest-button" disabled={saving}>{saving?'Saving…':'Save profile'}<Check size={17}/></button></form></div>;
}
function CropForm({ area, onSave, initial }) {
  const today = new Date(); const localDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const [form,setForm]=useState(initial || {crop:'',planted_on:localDate,status:'planned',area,notes:''}); const [busy,setBusy]=useState(false); const [error,setError]=useState('');
  return <form className="profile-form" onSubmit={async e=>{e.preventDefault();setBusy(true);setError('');try{await onSave(form);}catch(e){setError(e.message);}finally{setBusy(false);}}}><div className="eyebrow">A NEW CHAPTER</div><h2>{initial ? 'Update your crop record.' : 'Add a crop to your journal.'}</h2><label>Crop name<input required maxLength={100} value={form.crop} onChange={e=>setForm({...form,crop:e.target.value})} placeholder="e.g. Groundnut"/></label><div className="form-grid"><label>Planting date<input required type="date" value={form.planted_on} onChange={e=>setForm({...form,planted_on:e.target.value})}/></label><label>Area in acres<input required type="number" min="0.01" max="100000" step="0.01" value={form.area} onChange={e=>setForm({...form,area:e.target.valueAsNumber})}/></label></div><label>Stage<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="planned">Planned</option><option value="growing">Growing</option><option value="harvested">Harvested</option></select></label><label>Field notes<textarea rows={3} maxLength={2000} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Planting notes, yield, or lessons for next season…"/></label>{error&&<p role="alert" className="form-error">{error}</p>}<button className="forest-button" disabled={busy}>{busy?'Saving…':'Save crop record'}<Plus size={18}/></button></form>;
}
function Botanical() { return <div className="botanical" aria-hidden="true"><div className="garden-orbit orbit-one"/><div className="garden-orbit orbit-two"/><svg viewBox="0 0 440 430" fill="none"><defs><linearGradient id="leafA" x1="50" y1="0" x2="350" y2="430" gradientUnits="userSpaceOnUse"><stop stopColor="#d5e8ac"/><stop offset=".5" stopColor="#88b778"/><stop offset="1" stopColor="#315f42"/></linearGradient><linearGradient id="leafB" x1="300" y1="60" x2="150" y2="380" gradientUnits="userSpaceOnUse"><stop stopColor="#b5d598"/><stop offset="1" stopColor="#527d50"/></linearGradient></defs><g className="plant-sway"><path d="M225 418C203 320 262 214 252 70" stroke="#bbce98" strokeWidth="4"/><path d="M237 326C163 341 81 280 79 211C156 210 216 250 237 326Z" fill="url(#leafA)"/><path d="M237 326L99 232" stroke="#e1edbf" strokeOpacity=".35"/><path d="M241 259C296 278 369 213 368 141C299 151 251 197 241 259Z" fill="url(#leafB)"/><path d="M241 259L349 163" stroke="#dce7b3" strokeOpacity=".4"/><path d="M254 201C187 219 116 166 122 98C195 104 239 145 254 201Z" fill="url(#leafA)"/><path d="M254 201L143 119" stroke="#e1edbf" strokeOpacity=".4"/><path d="M253 125C291 119 329 64 300 13C252 40 238 81 253 125Z" fill="url(#leafB)"/><path d="M253 125L295 33" stroke="#e1edbf" strokeOpacity=".4"/></g></svg><span className="garden-spark spark-one"/><span className="garden-spark spark-two"/></div>; }
