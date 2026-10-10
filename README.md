# Crop Decision AI — FastAPI + React

A full-stack crop decision-support MVP.

## Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: FastAPI + Pydantic
- ML: scikit-learn RandomForest baseline
- Recommendation: hybrid ML + agronomic constraints
- Explainability: feature contributions from the hybrid scoring layer

## Run backend

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

The frontend expects the API at `http://localhost:8000`.

## Important
The included model is a DEMO baseline trained on generated profiles so the project runs immediately. It must not be described as field-validated. Replace it with a properly sourced agricultural dataset and perform spatial/temporal validation before making real-world claims.

---

## Farmer-Friendly Wizard Flow

The frontend has been redesigned for low-literacy smallholder farmers. Instead of one long form with 12 technical fields, there is a **5-step wizard** with one question per screen, picture cards, and voice support.

### Wizard steps

| Step | What the farmer sees | What it maps to |
|------|---------------------|-----------------|
| **0. Language** | English / Telugu / Hindi picker + privacy notice | Sets UI language (`i18n.js`) |
| **1. Location** | "Where is your farm?" — text input or GPS button | Auto-fetches temperature, humidity, rainfall from Open-Meteo. Auto-detects season from today's date. |
| **2. Soil** | Three paths: Soil Health Card, "I don't know" (picture cards for soil colour + growth quality), or "Use my area's average" | Maps to N, P, K, pH via lookup table (`mappings.js` → `SOIL_COLOR_MAP` + `GROWTH_MULTIPLIER`) |
| **3. Water + Area** | Picture cards: Rain / Canal / Borewell / Drip. Area slider in acres with guntas readout. | Maps water source to litres/day/acre (`WATER_SOURCE_MAP`). Multiplies by farm area. |
| **4. Previous crop** | Grid of emoji + text cards for 7 crops + "Nothing" | Sends crop name string to API |
| **5. Objective** | 4 plain-language goals: "Maximum profit", "Safe and steady", "Save water", "Balanced" | Maps to API keys: `income`, `low_risk`, `water_saving`, `balanced` |
| **Results** | Traffic-light cards (🟢 Very Good / 🟡 Good / 🔴 Risky) with "Why this crop?" in 2-3 lines. "Expert details" toggle shows confidence, factor bars. | Directly renders API response |

**Expert mode** (toggle in progress bar) restores the original 12-field form for agriculture officers and students.

### Key source files

| File | Purpose |
|------|---------|
| `src/i18n.js` | All UI strings for en, te, hi |
| `src/mappings.js` | Lookup tables + `buildApiPayload()` assembler |
| `src/utils.js` | Open-Meteo weather fetch, GPS, Web Speech API, localStorage |
| `src/App.jsx` | Wizard steps, results, expert mode |

### How to add a language

1. Open `src/i18n.js`.
2. Copy the entire `en` object and rename it (e.g. `const kn = { ... }`).
3. Translate every string value. Functions like `stepOf` accept parameters — keep the arrow function, translate only the template string.
4. Add an entry to the `LANGUAGES` array: `{ code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', voiceCode: 'kn-IN' }`.
5. Register the object in `const strings = { en, te, hi, kn }`.

### Mapping table assumptions

All mapping values in `mappings.js` are documented with inline comments. Key assumptions to verify with an agronomist:

- **Soil colour → N/P/K/pH**: median values from ICAR Soil Health Card scheme published ranges.
- **Growth multiplier**: Poor = 0.75×, Average = 1.0×, Good = 1.15× applied to N, P, K.
- **Water source → litres/day/acre**: Rain-only 400 L, Canal 1200 L, Borewell 1800 L, Drip 2200 L.
- **Season detection**: Kharif Jun 1 – Oct 15, Rabi Oct 16 – Feb 28, Zaid Mar 1 – May 31. Zaid maps to kharif for the model.
- **Budget** is hardcoded at ₹50,000 (demo default) since the model doesn't vary strongly on it.


## Accounts, profiles, and crop history

The Cropwise dashboard includes Google sign-in, an editable farm profile, saved recommendation history with the original farm inputs, and a crop journal with planned / growing / harvested stages. Crop records can be edited or deleted. The guest planner remains available without sign-in; guest recommendations are not saved to an account.

Account data is stored in SQLite at `backend/data/crop.db`. Back up this file and keep it private. `DATABASE_PATH` can point to another persistent location. Every profile, history, and journal request is scoped to the signed-in user. Google ID tokens are verified on the server; the browser receives an opaque, HttpOnly session cookie, not a stored Google token. Sessions expire after seven days and are revoked at sign-out.

### Enable Google sign-in

1. In [Google Cloud Console](https://console.cloud.google.com/), create or select your project and configure Google Auth Platform branding, audience, and contact details. If the app is in testing, add the Google accounts that will test it.
2. Create an OAuth client of type **Web application**. Add `http://localhost:5173` and `http://127.0.0.1:5173` under **Authorized JavaScript origins**. If using the preview on port 5174, add that exact origin too. This implementation uses Google's JavaScript credential callback; it does not require an OAuth redirect endpoint or client secret.
3. Copy the client ID. Create `backend/.env` from `backend/.env.example` and replace `GOOGLE_CLIENT_ID` with the real value. Do not put a client secret in the frontend.
4. From `backend`, install dependencies and start the API with its environment file:

   ```powershell
   .venv/Scripts/python.exe -m pip install -r requirements.txt
   .venv/Scripts/python.exe -m uvicorn app.main:app --reload --port 8000 --env-file .env
   ```

5. From `frontend`, run `npm install` and `npm run dev`. Open the app and select **Sign in**. If no client ID is configured, the app explains that setup is pending instead of simulating a login.

Official references: [Google web client setup](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid) and [server-side token verification](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token).

### Hosting

The frontend now calls `/api` on its own origin. Vite forwards this to `http://127.0.0.1:8000` during development and preview. In production, configure your HTTPS host/reverse proxy to send `/api` to FastAPI and serve the built frontend from the same origin. Set `COOKIE_SECURE=true`, configure `ALLOWED_ORIGINS` for the real origin, and register that exact HTTPS origin with Google. Persist and back up the SQLite data directory. A multi-instance deployment should use a shared transactional database rather than separate SQLite files.

### Checks

```powershell
# frontend
npm test
npm run build
# backend
.venv/Scripts/python.exe -m unittest discover -s tests -v
```

Authentication tests mock Google's external token verifier, then exercise real sessions, profile persistence, history, crop records, rejected credentials, and separation between accounts. They do not substitute for a final sign-in test with a configured Google client ID.

The dashboard uses an original SVG botanical illustration, translucent panels, responsive navigation, gently animated leaves, and reduced-motion support. New account/dashboard screens are in English; the crop planner retains English, Telugu, and Hindi.
