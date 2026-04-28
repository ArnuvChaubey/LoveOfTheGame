# LifeLink

AI-powered surplus rescue platform that turns messy emergency text into live prioritized action.

## Screenshot

`[Add hackathon demo screenshot here]`

## Problem

India wastes 78M tonnes of food annually while 194M people remain undernourished. The gap is not supply, but response speed and coordination. Similar coordination failure appears in blood donation and disaster relief.

## Solution Overview

LifeLink ingests raw field text (WhatsApp/SMS/calls), uses Gemini to extract structured request details, and pushes them into a dynamic priority queue. The urgency engine continuously recalculates every request score using time decay, scarcity, isolation, match-failure escalation, and source trust.

A matching engine then selects the best nearby provider using domain constraints (dietary compatibility, blood compatibility, or relief resource matching), distance, reliability, and capacity.

A live dashboard visualizes requests on a Chennai map, real-time queue movement, and impact analytics. A module switcher instantly pivots the same platform across Food Rescue, Blood Donation, and Disaster Relief.

## Architecture

```text
Raw Text Message
      |
      v
Gemini Extraction (NLP)
      |
      v
Structured Request Object
      |
      v
Priority Queue + Urgency Scoring Loop (10s)
      |
      v
Matching Engine
      |
      +------------------> Live Map
      |
      +------------------> Queue Sidebar
      |
      +------------------> Analytics Dashboard
```

## Prioritization Algorithm

`urgency_score = (w1 × time_decay) + (w2 × scarcity_index) + (w3 × isolation_factor) + (w4 × match_failure_escalation) + (w5 × source_trust)`

- `time_decay`: exponential increase as request nears expiry/deadline.
- `scarcity_index`: resource rarity score from module config.
- `isolation_factor`: nearest provider distance normalized by max radius.
- `match_failure_escalation`: linear escalation the longer request stays unmatched.
- `source_trust`: confidence from source type lookup.

## Tech Stack

- React + Vite
- Tailwind CSS
- React Leaflet + OpenStreetMap
- Recharts
- Framer Motion
- Gemini API (Google AI Studio)
- Firebase Hosting

## Google Services Used

- Gemini 2.0 Flash (`generateContent`)
- Google Maps Geocoding (frontend helper integration point)
- Firebase Hosting

## Setup

1. `git clone <repo-url>`
2. `cd lifelink/frontend`
3. `npm install`
4. `cp .env.example .env` and add `VITE_GEMINI_API_KEY`
5. `npm run dev`

## Deployment

1. `cd frontend`
2. `npm run build`
3. `firebase deploy`

## Team

`[Add team member names and roles]`

## SDGs Addressed

- SDG 2: Zero Hunger
- SDG 12: Responsible Consumption and Production
- SDG 13: Climate Action
