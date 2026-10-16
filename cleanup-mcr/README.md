# CleanUP MCR

Snap a photo of a small local problem in Manchester. AI sorts it, the council funds it, and a local resident is paid a fixed fee to fix it.

## How it works

1. **Report**: resident uploads a photo and postcode. AI (Google Gemini) describes the photo, sizes the issue, rates risk and picks a route: council crew, community task, or "unclear, send another photo".
2. **Confirm**: the resident sees a plain-English summary before anything is sent.
3. **Task board**: community tasks show area, size, time estimate and a fixed fee from the rate card (`src/constants.js`).
4. **Worker flow**: accept a task, do it, upload an after photo.
5. **Before/after check**: AI compares the photos and marks the job as likely complete. A council officer approves or rejects payment.
6. **Staff dashboard**: open, awaiting, done and rejected tasks, cost so far, and a hotspot map.
7. **Safety rules**: hazards (needles, asbestos, chemicals, roads) are hard-blocked and sent to the crew, both by keyword in the note and by the vision check.

## Run it

```bash
npm install
cp .env.example .env     # add your GEMINI_API_KEY (Google AI Studio)
npm run dev              # Vite on :5173, API on :3001
```

Open http://localhost:5173. Without a key the photo check fails safe: reports are not approved and the officer is told to check by eye.

## Layout

```
server/index.js          Express API: /api/triage, /api/compare (calls Gemini, key stays server-side)
src/api.js               client calls, image downscaling, mapping AI output to routes
src/constants.js         rate card, hazard keywords, seed data
src/components/          Report, Board, Worker, Staff
```

## Not built yet (prototype limits)

- State is in memory and resets on refresh: add a database (Postgres/Supabase) for tasks, users and payments.
- No auth: add resident, worker and council-officer roles.
- Payments are only a status flag: integrate a real payout provider and ID/right-to-work checks.
- The hotspot map places postcodes on a grid: geocode postcodes and use a real map (Leaflet/Mapbox).
- Add rate limiting and upload size checks on the API before any public deployment.
