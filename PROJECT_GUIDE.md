# Crop Decision AI — Project and Learning Guide

This guide explains the project as it exists in this repository: its app variants,
architecture, request and recommendation workflows, tools, data, setup, and
limitations. Start with the **Vite + FastAPI application** for the most complete
end-to-end path. The other folders contain separate earlier or alternative
implementations; they do not all share the same backend or persistence.

> **Agricultural guidance is a demo.** The recommendation profiles and factors
> have not been validated for a particular region or farm. Treat results as
> educational decision support, not as a planting or investment guarantee.

## 1. Project map

| Path | Role | How it relates to the main app |
|---|---|---|
| [`frontend/`](./frontend/) | React farmer-facing wizard and Cropwise dashboard, built with Vite | Main browser UI. Calls the `backend/` API through `/api`. |
| [`backend/`](./backend/) | FastAPI service, hybrid recommendation logic, Google sign-in, profiles, history, journal | Main API. Uses a demo classifier created in Python code and stores account data in SQLite. |
| [`main.py`](./main.py) | Earlier, small FastAPI prediction API | Separate legacy API. Loads a joblib model and serves `POST /predict`; it is not the `backend/` service. |
| [`app.py`](./app.py) | Streamlit form UI | Alternative UI for the legacy `main.py` API. |
| [`train.py`](./train.py) | Trains the legacy joblib crop classifier | Produces `crop_model.pkl` for `main.py`. |
| [`merge_and_train.py`](./merge_and_train.py) | Optional experiment that augments the original crop data with generated crop profiles and trains another model | Separate from the `backend/` recommendation model. |
| [`crop-frontend/`](./crop-frontend/) | Standalone Next.js dashboard with a form, profile, history, and helper chat | Another app variant. It calls the legacy `/predict` API and stores its profile/history in browser storage, rather than using the account-aware backend. It is also a separate nested Git repository. |
| `Crop_recommendation.csv`, `crop_yield.csv` | Source datasets used by the model experiments | Training/experiment inputs; not queried by the running `backend/` API. |
| `Crop_recommendation!.csv` | Additional CSV present in the workspace | Not referenced by the training scripts described below. |
| `crop_model.pkl`, `Crop_recommendation.pkl` | Serialized model files for the legacy API | `main.py` prefers `crop_model.pkl`, then falls back to `Crop_recommendation.pkl`. |

### Which app should I study first?

Follow this connected path:

1. [`frontend/src/FarmApp.jsx`](./frontend/src/FarmApp.jsx) and
   [`frontend/src/App.jsx`](./frontend/src/App.jsx): UI and crop-planning flow.
2. [`frontend/src/mappings.js`](./frontend/src/mappings.js) and
   [`frontend/src/api.js`](./frontend/src/api.js): convert answers and make API
   requests.
3. [`backend/app/main.py`](./backend/app/main.py),
   [`backend/app/api/recommendations.py`](./backend/app/api/recommendations.py),
   [`backend/app/schemas.py`](./backend/app/schemas.py), and
   [`backend/app/services/recommendation.py`](./backend/app/services/recommendation.py):
   request validation and recommendation calculation.
4. [`backend/app/accounts.py`](./backend/app/accounts.py): sign-in, SQLite
   persistence, profile, history, and crop journal.

Study [`main.py`](./main.py), [`app.py`](./app.py), and [`train.py`](./train.py)
as a smaller, independent example of a classifier API, a simple UI, and model
training. Do not confuse its model or `/predict` response with the main API's
`/api/recommend` response.

## 2. Architecture at a glance

```text
Main application
┌──────────────────────────────────┐        /api/*        ┌────────────────────────────────┐
│ frontend/                        │ ───────────────────▶ │ backend/app/main.py             │
│ React 19 + Vite + Tailwind CSS    │   Vite proxy in dev  │ FastAPI + Pydantic              │
│ Wizard, dashboard, profile,       │                      │ recommendations, auth, records  │
│ history, crop journal             │ ◀─────────────────── │                                │
└──────────────────────────────────┘      JSON/cookie     └──────────────┬─────────────────┘
                                                                        │
                                                  ┌─────────────────────┴─────────┐
                                                  │                               │
                                     recommendation.py                 accounts.py
                                     demo ML + scoring                  SQLite database
```

Two separate alternative flows also exist:

```text
Legacy flow:     app.py (Streamlit) ──HTTP──▶ main.py (FastAPI) ──▶ crop_model.pkl
Next.js variant: crop-frontend/ ──HTTP──▶ main.py at 127.0.0.1:8000
                 (browser profile/history are stored in localStorage)
```

The main Vite development server runs on port `5173`; its Vite configuration
forwards `/api` requests to `http://127.0.0.1:8000`. The legacy API and the
account-aware backend both default to port `8000`, so run only one of them on
that port at a time.

## 3. Main recommendation workflow

### 3.1 From farmer answers to API input

The wizard in [`frontend/src/App.jsx`](./frontend/src/App.jsx) collects the
inputs over several screens rather than asking the farmer to fill a technical
form all at once:

1. **Language:** English, Telugu, or Hindi. Labels and messages come from
   [`frontend/src/i18n.js`](./frontend/src/i18n.js).
2. **Location and weather:** the farmer can type a place or use browser GPS.
   [`frontend/src/utils.js`](./frontend/src/utils.js) uses Open-Meteo's free
   geocoding and forecast endpoints to resolve a place and fetch weather.
   The browser Geolocation API requires the farmer's permission. If a request
   cannot be completed, the wizard uses its demo climate defaults.
3. **Soil:** enter nitrogen, phosphorus, potassium, and pH values from a Soil
   Health Card, choose a simple soil-colour/growth estimate, or use regional
   defaults. The estimates are lookup assumptions in
   [`frontend/src/mappings.js`](./frontend/src/mappings.js), not laboratory
   measurements.
4. **Water and farm area:** choose rain, canal, borewell, or drip irrigation and
   enter farm area in acres. The UI multiplies a demo litres-per-day-per-acre
   constant by area.
5. **Previous crop and objective:** the previous crop and one of the goals
   (profit, safer/steadier, water-saving, balanced) become backend fields.
6. **Payload:** `buildApiPayload()` assembles the values and sends
   `POST /api/recommend`. `seasonForApi()` maps the wizard's Zaid season to
   Kharif because the recommendation profiles only distinguish Kharif and Rabi.

The browser API helper in [`frontend/src/api.js`](./frontend/src/api.js) sets
JSON headers, same-origin cookie credentials, and the `X-Crop-Client: web`
header. Vite proxies the relative `/api` URL, avoiding separate frontend and
backend URLs in development.

### 3.2 How recommendations are produced

The main backend's logic is in
[`backend/app/services/recommendation.py`](./backend/app/services/recommendation.py):

1. At module import, `_make_demo_model()` generates random examples around
   hard-coded crop profiles and fits a scikit-learn `RandomForestClassifier`.
   A fixed random seed makes this demo model reproducible.
2. The seven measured features are nitrogen, phosphorus, potassium, pH,
   temperature, humidity, and rainfall. The classifier produces a probability
   for each profile crop.
3. For each candidate crop, the service calculates component scores:
   - **Soil:** closeness of N, P, K, and pH to that crop's profile.
   - **Climate:** closeness of temperature, humidity, and rainfall.
   - **Water:** available water compared with the profile's estimated
     requirement multiplied by farm area.
   - **Season:** full score when the season is listed for that crop, otherwise
     a partial score.
   - **Rotation:** a repeated crop receives a penalty.
   - **Market:** a fixed demo factor for the crop.
   - **ML signal:** the classifier probability.
4. The chosen objective changes the weights in the combined suitability score.
   The service sorts the crop profiles by this score and returns the top three,
   including reasons, risks, factor percentages, risk labels, and a disclaimer.

The returned `suitability` is the combined heuristic score expressed as a
percentage; it is **not** the classifier's probability or a measured probability
of yield. Likewise, the displayed `confidence` is a formula based on the
classifier signal and soil score; it is not a statistically calibrated
confidence interval.

`soil_type`, `budget`, and `location` are accepted by the request schema and
sent by the UI, but the current scoring function does not use those fields.
The `what-if` endpoint changes only the available-water value before running
the same ranking.

### 3.3 Data persistence after a recommendation

The recommendation endpoint allows guest requests. If the request has a valid
signed-in session, the backend saves both the submitted farm values and the
response in the user's recommendation history. A guest can use the planner, but
the guest recommendation is not saved to an account.

Authenticated profile, history, and journal records are stored in SQLite,
normally at `backend/data/crop.db`. That path is ignored by Git. Set
`DATABASE_PATH` to use another location. The journal supports planned, growing,
and harvested records, plus editing and deleting a record.

## 4. API reference

The account-aware API is mounted under `/api` by
[`backend/app/main.py`](./backend/app/main.py). FastAPI also publishes an
interactive schema at `/docs` while the service is running.

| Method and path | Purpose | Access |
|---|---|---|
| `GET /api/health` | Basic service health check | Public |
| `GET /api/crops` | List crop profile names | Public |
| `POST /api/recommend` | Validate farm inputs and return up to three recommendations | Guest or signed-in |
| `POST /api/what-if` | Re-run recommendations after a percentage water-availability change | Public |
| `GET /api/auth/config` | Return Google client ID and issue a short-lived sign-in nonce | Public |
| `POST /api/auth/google` | Verify a Google ID token and create a server session | Public, with nonce |
| `POST /api/auth/logout` | Revoke the current session | Public endpoint; clears current cookie |
| `GET /api/me` | Read the signed-in profile | Signed-in |
| `PATCH /api/me` | Update the signed-in profile | Signed-in |
| `GET /api/history` | Read the signed-in user's recent recommendations | Signed-in |
| `GET /api/journal` | Read the signed-in user's crop records | Signed-in |
| `POST /api/journal` | Add a crop record | Signed-in |
| `PATCH /api/journal/{record_id}` | Edit an owned crop record | Signed-in |
| `DELETE /api/journal/{record_id}` | Delete an owned crop record | Signed-in |

`FarmInput` and `WhatIfRequest` in
[`backend/app/schemas.py`](./backend/app/schemas.py) define the accepted types
and numeric bounds. Pydantic rejects invalid request shapes before the
recommendation function runs.

## 5. Sign-in and account data flow

The account flow is implemented in
[`backend/app/accounts.py`](./backend/app/accounts.py) and the sign-in UI in
[`frontend/src/FarmApp.jsx`](./frontend/src/FarmApp.jsx):

1. The browser asks `/api/auth/config` for the Google client ID and a nonce.
   The backend stores a hash of the short-lived nonce challenge in SQLite and
   sets a temporary nonce cookie.
2. Google Identity Services runs in the browser and returns a credential.
3. The browser posts that credential to `/api/auth/google`.
4. The server verifies the token with Google's verifier, checks the audience,
   nonce, and verified email, consumes the one-time challenge, and creates a
   random server session.
5. The browser receives an opaque `HttpOnly` cookie. The raw session token is
   not returned in the JSON response; its hash is stored in SQLite. Later API
   requests send the cookie automatically.
6. Profile, history, and journal SQL queries are scoped to the authenticated
   user's ID. Logout deletes the session and clears the cookie.

For local Google sign-in, copy
[`backend/.env.example`](./backend/.env.example) to `backend/.env` and set
`GOOGLE_CLIENT_ID` to a Google OAuth **Web application** client ID whose
authorized origins include the local Vite URL. The backend launch command below
loads this file. Do not put a Google client secret in the frontend. The example
sets `COOKIE_SECURE=false` for local HTTP; use HTTPS and set `COOKIE_SECURE=true`
for a production deployment.

The API applies a CORS allowlist and checks `X-Crop-Client: web` on
state-changing requests involving accounts or an existing session. This is a
defense-in-depth request check, not a substitute for HTTPS, correct origin
configuration, secure cookie settings in production, or careful deployment.

## 6. Tools and technologies by feature

| Tool / technology | Where it is used | What it does here |
|---|---|---|
| **Python** | `backend/`, `main.py`, `app.py`, training scripts | API services, validation, model experiments, and the small Streamlit alternative UI |
| **FastAPI** | `backend/app/main.py`, root `main.py` | Defines HTTP endpoints and serves JSON |
| **Pydantic 2** | `backend/app/schemas.py`, `backend/app/accounts.py` | Validates request fields, bounds, and journal/profile data |
| **Uvicorn** | Backend run command | ASGI server that runs FastAPI locally |
| **NumPy** | `backend/app/services/recommendation.py`, training scripts | Numeric feature arrays, score calculations, and reproducible sample generation |
| **scikit-learn** | `backend/app/services/recommendation.py`, `train.py`, `merge_and_train.py` | Random Forest classifier implementation and train/test helpers |
| **joblib** | `main.py`, `train.py`, `merge_and_train.py` | Serializes and loads the standalone trained classifier |
| **pandas** | `train.py`, `merge_and_train.py` | Reads and transforms the CSV training datasets |
| **SQLite** | `backend/app/accounts.py` | Persists users, session hashes, sign-in challenges, recommendation history, and journal records |
| **Google Identity Services + `google-auth`** | `frontend/src/FarmApp.jsx`, `backend/app/accounts.py` | Browser sign-in UI and server-side Google token verification |
| **React 19** | `frontend/src/` | Builds the interactive wizard and dashboard from components and state |
| **Vite** | `frontend/vite.config.js` | Local development server, build tooling, and `/api` proxy |
| **Tailwind CSS 3** | `frontend/tailwind.config.js`, `frontend/src/index.css` | Utility CSS styling for the wizard and reusable visual components |
| **Framer Motion** | `frontend/src/App.jsx`, `frontend/src/FarmApp.jsx` | Transitions, animated components, and reduced-motion-aware UI |
| **Lucide React** | Frontend components | Icon components |
| **Open-Meteo** | `frontend/src/utils.js` | No-key geocoding and weather lookups from place names or coordinates |
| **Browser Geolocation API** | `frontend/src/utils.js` | Asks the user for location permission to fetch local weather |
| **Web Speech API** | `frontend/src/utils.js`, result UI | Speaks recommendation text when browser speech synthesis is available; helper utilities also expose browser speech recognition |
| **Browser `localStorage`** | Vite wizard; separately, Next.js variant | Saves wizard progress locally. The Next.js variant separately stores its demo profile and history locally. |
| **Node.js test runner** | `frontend/src/*.test.js` | Runs mapping, API helper, and rendered-result/dashboard tests |
| **unittest + FastAPI TestClient** | `backend/tests/test_accounts.py` | Exercises authentication, account isolation, history, journal, validation, and guest behavior |
| **Streamlit + Requests** | `app.py` | Simple standalone UI that posts form values to the legacy prediction API |
| **Next.js 16 + TypeScript + Tailwind 4** | `crop-frontend/` | Separate dashboard implementation; its tooling is independent of the Vite UI |

## 7. Model and data workflows

### Legacy model workflow

[`train.py`](./train.py) is the direct training script:

1. Reads `Crop_recommendation.csv` with pandas.
2. Uses `N`, `P`, `K`, `ph`, `temperature`, `humidity`, and `rainfall` as
   features and `label` as the target crop.
3. Splits rows into training and test portions (80/20, fixed seed).
4. Fits a 100-tree `RandomForestClassifier`.
5. Writes `crop_model.pkl` with joblib.

The legacy API loads that pickle at startup and returns one predicted crop from
`POST /predict`. The pickle must only be loaded from a trusted source and is
coupled to the Python/scikit-learn environment used to create it.

[`merge_and_train.py`](./merge_and_train.py) is a different experiment. It reads
the crop recommendation and crop yield CSV files and computes crop rainfall
statistics from the yield file. It then defines hand-written ranges for
additional crops, generates synthetic rows for those profiles, combines them
with the original labelled rows, evaluates a Random Forest split, and writes a
combined CSV plus `crop_model.pkl`. The computed rainfall statistics are not
used in that synthetic-row generation. It should be read as experimental
augmentation, not as evidence that the added crops have been trained on
field-level ground truth. Run it from the repository root because its data and
output paths are relative to the current directory.

The account-aware backend does **not** load either pickle. It creates its own
small demo Random Forest from the `CROPS` dictionary in
`recommendation.py` when imported, then uses that classifier as one input to a
larger hand-weighted ranking.

## 8. Run the main application locally

Use two terminals from the repository root.

### Terminal 1: API

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
# Edit .env and set GOOGLE_CLIENT_ID if you want Google sign-in.
python -m uvicorn app.main:app --reload --port 8000 --env-file .env
```

Open `http://127.0.0.1:8000/docs` for the interactive API schema. The planner
works without Google sign-in; account features require a valid configured
Google client ID.

### Terminal 2: Vite frontend

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite forwards `/api` to the backend on port 8000.

## 9. Run the other app variants

### Streamlit plus legacy FastAPI

The root `main.py` API and `app.py` UI are an independent minimal example.
Install the packages needed by those scripts (including Streamlit, Requests,
NumPy, FastAPI, joblib, and scikit-learn) in an environment, then run:

```powershell
# From the repository root, terminal 1:
python -m uvicorn main:app --reload --port 8000

# Terminal 2:
python -m streamlit run app.py
```

Train or replace `crop_model.pkl` with `train.py` before running the API if
needed. This API is different from `backend/app/main.py`; do not start both on
port 8000 at the same time.

### Next.js variant

```powershell
cd crop-frontend
npm install
npm run dev
```

It starts a separate Next.js UI, normally on port 3000. Its dashboard calls the
legacy `http://127.0.0.1:8000/predict` endpoint and saves history/profile data in
that browser's `localStorage`. It does not call the account-aware `/api`
endpoints. Keep the legacy API running if you want its prediction form to work.

## 10. Tests and build checks

From `frontend/`:

```powershell
npm test
npm run build
```

From `backend/`, after installing `requirements.txt`:

```powershell
python -m unittest discover -s tests -v
```

The backend tests use temporary SQLite databases and mock Google's token
verifier; they do not require a real Google sign-in. They cover guest
recommendation behavior, session expiry, request validation, and isolation
between accounts. The frontend tests check API request behavior, mappings, and
selected rendered result/dashboard output.

For the Next.js variant, its package scripts include `npm run lint`,
`npm run build`, and `npm start`. Run them from `crop-frontend/`, not
`frontend/`.

## 11. Important limitations and follow-up learning

- **Do not treat scores as agronomic guarantees.** The main backend uses
  hard-coded crop profiles and demo market/water values. Validate assumptions
  with agricultural experts and appropriate regional data before real use.
- **Two models mean two behaviors.** The root `/predict` API loads a pickle and
  returns one label; `/api/recommend` uses an in-memory demo classifier plus
  explicit scoring and returns a ranked list of three.
- **Synthetic augmentation is not field validation.** The extra crop samples
  in `merge_and_train.py` are generated from manually supplied ranges.
- **Weather values are estimates.** Open-Meteo current conditions and the
  frontend's rainfall scaling are not a historical climate normal or a
  farm-specific forecast.
- **Soil and water mappings are assumptions.** The values in
  `mappings.js` are convenient UI conversions, not substitutes for soil tests,
  local irrigation measurements, or expert advice.
- **Some API schema fields do not yet influence ranking.** `soil_type`,
  `budget`, and `location` are accepted but unused in the scoring function.
- **Separate app implementations can drift.** The Vite UI, Next.js UI, and
  Streamlit UI have different routes, data storage, and interfaces; changing one
  does not automatically update the others.
- **Training dependencies are not the same as backend dependencies.** The
  backend's requirements file is scoped to the service. The root training
  scripts also need pandas (and use joblib); install those in a separate
  development environment if training.
- **Production needs deployment work.** Use HTTPS, secure cookies, a
  production origin allowlist, persistent database storage, backups, and a
  shared transactional database for multiple service instances.

Suggested learning sequence:

1. Run the main API and UI, then inspect requests in the browser Network panel.
2. Read `buildApiPayload()` and compare its JSON with `FarmInput`.
3. Follow `POST /api/recommend` into `recommend()` and trace one candidate's
   soil, climate, water, and objective scores.
4. Trace Google sign-in from `/auth/config` through session-cookie creation and
   then query `/api/me`.
5. Read the focused tests before changing account behavior.
6. Compare the legacy pickle workflow with the backend's in-memory demo model.
7. Change one well-defined behavior, add or update its test, and run the
   relevant frontend or backend checks.
