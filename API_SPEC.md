# API Specification

## Base URL
`http://localhost:5000/api`

## Endpoints

### Health Check
`GET /api/health`

---

### Soil Analysis
`POST /api/soil/analyze`
```json
{
  "nitrogen": 240,
  "phosphorus": 18,
  "potassium": 200,
  "ph": 6.5,
  "organicCarbon": 0.65,
  "location": "Ahmedabad"
}
```

`POST /api/soil/upload` — Multipart form data with `soilReport` file

`GET /api/soil/history`

---

### Crop Recommendation
`POST /api/crop/recommend`
```json
{
  "nitrogen": 240,
  "phosphorus": 18,
  "potassium": 200,
  "ph": 6.5,
  "location": "Gujarat",
  "season": "Rabi"
}
```

---

### Fertilizer Plan
`POST /api/fertilizer/plan`
```json
{
  "nitrogen": 120, "phosphorus": 8, "potassium": 90,
  "ph": 6.5, "crop": "Wheat"
}
```

`POST /api/fertilizer/safety`
```json
{
  "nitrogen": 120, "phosphorus": 8, "potassium": 90,
  "ph": 6.5, "weatherSummary": "Rain expected", "crop": "Wheat"
}
```

---

### Weather
`GET /api/weather/:location`
Example: `GET /api/weather/Ahmedabad`

---

### Market
`POST /api/market/predict`
```json
{ "crop": "Wheat", "location": "Gujarat", "currentPrice": 2500 }
```

---

### Mandi
`POST /api/mandi/compare`
```json
{
  "crop": "Wheat", "location": "Gujarat",
  "mandiPrices": [
    { "name": "Ahmedabad", "price": 2500 },
    { "name": "Rajkot", "price": 2400 }
  ]
}
```

---

### Government Schemes
`POST /api/schemes/find`
```json
{ "location": "Gujarat", "crop": "Wheat" }
```

---

### AI Master Mode
`POST /api/ai/master`
```json
{
  "soilData": { "nitrogen": 240, "phosphorus": 18, "potassium": 200, "ph": 6.5 },
  "location": "Gujarat",
  "crop": "Wheat",
  "season": "Rabi",
  "farmerQuery": "Meri mitti kaisi hai aur kya ugaun?"
}
```

`POST /api/ai/recovery`
```json
{ "problem": "Flood damage", "soilData": { "nitrogen": 100, "phosphorus": 5, "potassium": 80, "ph": 7 } }
```

`POST /api/ai/calendar`
```json
{ "crop": "Wheat", "season": "Rabi", "location": "Gujarat" }
```

---

## Response Format
```json
{
  "success": true,
  "message": "description",
  "data": { ... },
  "timestamp": "2026-04-03T00:00:00.000Z"
}
```
