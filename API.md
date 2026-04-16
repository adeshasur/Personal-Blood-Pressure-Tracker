# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Health Check

### GET /health
Check if the API is running.

**Request:**
```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-04-16T10:30:00.000Z"
}
```

---

## Pressure Readings

### POST /pressure
Create a new blood pressure reading.

**Request:**
```bash
curl -X POST http://localhost:5000/api/pressure \
  -H "Content-Type: application/json" \
  -d {
    "systolic": 120,
    "diastolic": 80,
    "pulse": 72,
    "category": "Morning"
  }
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| systolic | Integer | ✅ | Systolic pressure (upper number) |
| diastolic | Integer | ✅ | Diastolic pressure (lower number) |
| pulse | Integer | ✅ | Heart rate in BPM |
| category | String | ✅ | One of: "Morning", "Afternoon", "Evening" |

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "systolic": 120,
  "diastolic": 80,
  "pulse": 72,
  "category": "Morning",
  "recorded_at": "2024-04-16T08:30:00.000Z",
  "created_at": "2024-04-16T10:30:00.000Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing required fields"
}
```

---

### GET /pressure
Get all blood pressure readings (paginated).

**Request:**
```bash
curl "http://localhost:5000/api/pressure?limit=50&offset=0"
```

**Query Parameters:**
| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| limit | Integer | 50 | 100 | Number of records to return |
| offset | Integer | 0 | - | Number of records to skip |

**Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "systolic": 120,
    "diastolic": 80,
    "pulse": 72,
    "category": "Morning",
    "recorded_at": "2024-04-16T08:30:00.000Z",
    "created_at": "2024-04-16T10:30:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "systolic": 125,
    "diastolic": 82,
    "pulse": 75,
    "category": "Afternoon",
    "recorded_at": "2024-04-16T14:00:00.000Z",
    "created_at": "2024-04-16T14:05:00.000Z"
  }
]
```

---

### GET /pressure/:id
Get a single blood pressure reading by ID.

**Request:**
```bash
curl http://localhost:5000/api/pressure/550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "systolic": 120,
  "diastolic": 80,
  "pulse": 72,
  "category": "Morning",
  "recorded_at": "2024-04-16T08:30:00.000Z",
  "created_at": "2024-04-16T10:30:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Reading not found"
}
```

---

### GET /pressure/date/:date
Get all readings for a specific date.

**Request:**
```bash
curl http://localhost:5000/api/pressure/date/2024-04-16
```

**Date Format:** `YYYY-MM-DD`

**Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "systolic": 120,
    "diastolic": 80,
    "pulse": 72,
    "category": "Morning",
    "recorded_at": "2024-04-16T08:30:00.000Z",
    "created_at": "2024-04-16T10:30:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "systolic": 125,
    "diastolic": 82,
    "pulse": 75,
    "category": "Afternoon",
    "recorded_at": "2024-04-16T14:00:00.000Z",
    "created_at": "2024-04-16T14:05:00.000Z"
  }
]
```

---

### GET /pressure/latest
Get the latest readings (one per category if available).

**Request:**
```bash
curl http://localhost:5000/api/pressure/latest
```

**Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "systolic": 120,
    "diastolic": 80,
    "pulse": 72,
    "category": "Morning",
    "recorded_at": "2024-04-16T08:30:00.000Z",
    "created_at": "2024-04-16T10:30:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "systolic": 125,
    "diastolic": 82,
    "pulse": 75,
    "category": "Afternoon",
    "recorded_at": "2024-04-16T14:00:00.000Z",
    "created_at": "2024-04-16T14:05:00.000Z"
  }
]
```

---

### GET /pressure/dashboard/stats
Get aggregated statistics for the last 30 days.

**Request:**
```bash
curl http://localhost:5000/api/pressure/dashboard/stats
```

**Response (200 OK):**
```json
[
  {
    "date": "2024-04-16",
    "avg_systolic": 122,
    "avg_diastolic": 81,
    "avg_pulse": 73,
    "min_systolic": 120,
    "max_systolic": 125,
    "min_diastolic": 80,
    "max_diastolic": 82
  },
  {
    "date": "2024-04-15",
    "avg_systolic": 118,
    "avg_diastolic": 79,
    "avg_pulse": 70,
    "min_systolic": 115,
    "max_systolic": 120,
    "min_diastolic": 78,
    "max_diastolic": 80
  }
]
```

---

### PUT /pressure/:id
Update a blood pressure reading.

**Request:**
```bash
curl -X PUT http://localhost:5000/api/pressure/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d {
    "systolic": 122,
    "diastolic": 81,
    "pulse": 74
  }
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| systolic | Integer | ✅ | Systolic pressure (upper number) |
| diastolic | Integer | ✅ | Diastolic pressure (lower number) |
| pulse | Integer | ✅ | Heart rate in BPM |

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "systolic": 122,
  "diastolic": 81,
  "pulse": 74,
  "category": "Morning",
  "recorded_at": "2024-04-16T08:30:00.000Z",
  "created_at": "2024-04-16T10:30:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Reading not found"
}
```

---

### DELETE /pressure/:id
Delete a blood pressure reading.

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/pressure/550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**
```json
{
  "message": "Reading deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Reading not found"
}
```

---

## Error Handling

The API returns standard HTTP status codes:

| Status | Meaning |
|--------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

## Example: Complete CRUD Flow

```bash
# 1. Create a reading
curl -X POST http://localhost:5000/api/pressure \
  -H "Content-Type: application/json" \
  -d '{"systolic": 120, "diastolic": 80, "pulse": 72, "category": "Morning"}'

# Save the ID from response: 550e8400-e29b-41d4-a716-446655440000

# 2. Get all readings
curl http://localhost:5000/api/pressure

# 3. Get specific reading
curl http://localhost:5000/api/pressure/550e8400-e29b-41d4-a716-446655440000

# 4. Update the reading
curl -X PUT http://localhost:5000/api/pressure/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"systolic": 122, "diastolic": 81, "pulse": 74}'

# 5. Delete the reading
curl -X DELETE http://localhost:5000/api/pressure/550e8400-e29b-41d4-a716-446655440000
```

## Authentication

Currently, the API has no authentication. For production, consider adding:
- JWT tokens
- API keys
- OAuth2

## CORS

The API allows requests from configured origins (default: `http://localhost:3000`). Set `CORS_ORIGIN` in `.env` to allow other domains.

## Rate Limiting

Currently not implemented. For production, consider:
- Adding rate limiting middleware
- Implementing request throttling
- Using services like Cloudflare

## Pagination Best Practices

- Use `limit` to control response size (recommended: 20-50)
- Use `offset` to paginate through results
- Example: Get records 51-100: `?limit=50&offset=50`
