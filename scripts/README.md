# Firebase Schema Seed Script

Temporary script to initialize **Firebase Realtime Database** for **The Tree Health Project**.

## Prerequisites

1. **Realtime Database** created in [Firebase Console](https://console.firebase.google.com/project/tthp-ec0a9/database).
2. Service account at `scripts/firebase/service-account.json` (already copied from your download).

## Run (local JSON — no Firebase required)

From the project root:

```bash
npm run seed:local
```

Writes `data/dataset.json` — used by the frontend dashboard until Firestore is connected.

## Run (Realtime Database cloud seed)

Requires Realtime Database enabled in Firebase Console.

```bash
cd scripts
npm install --strict-ssl=false
npm run seed:firebase
```

Database URL defaults to `https://tthp-ec0a9-default-rtdb.asia-southeast1.firebasedatabase.app`.
Override with `FIREBASE_DATABASE_URL` if your region differs.

## What it creates

| Collection | Purpose |
|------------|---------|
| `users` | Role-based user profiles (admin, management, field_team) |
| `trees` | Tree inventory with GPS, health, QR codes |
| `zones` | GIS zones/blocks |
| `soil_readings` | Soil parameters per tree/zone |
| `images` | Image metadata (URLs only — not binary in DB) |
| `disease_records` | Disease detections + verification status |
| `pest_records` | Pest detections + verification status |
| `growth_records` | Height/canopy/diameter over time |
| `recommendations` | Rule-based remedial actions |
| `maintenance_tasks` | Workflow tickets |
| `alerts` | Operational alerts |
| `notifications` | In-app notification center |
| `activity_logs` | User activity |
| `audit_trail` | Old/new value audit |
| `reports` | Generated report metadata |
| `config` | Admin thresholds, species, categories, rules |
| `_schema` | Schema documentation metadata |

## Role-based access (dynamic)

Module visibility, feature options, and dashboard widgets are driven by `data/dataset.json`:

| Config key | Purpose |
|------------|---------|
| `config.roles.permissions` | Permissions per role |
| `config.module_access` | Which modules each role can open |
| `config.module_features` | Which options appear inside each module |
| `config.dashboard_widgets` | Which dashboard panels each role sees |

Edit `scripts/firebase/dataset.mjs` and run `npm run seed:local` to regenerate the dataset after changes.

## Sample seed users

| Email | Role |
|-------|------|
| admin@tthp.local | admin |
| manager@tthp.local | management |
| field@tthp.local | field_team (field + maintenance) |

Link these to Firebase Auth users when auth is wired up.
