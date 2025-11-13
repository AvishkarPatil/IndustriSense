# QR Code Scanning Flow

## Backend Implementation

### 1. Generate QR Code
```
GET /api/machines/{id}/qr/
```

QR code contains JSON:
```json
{
  "machine_id": "CNC-001",
  "api_url": "/api/machines/by-code/CNC-001"
}
```

### 2. Scan QR Code (Frontend)

When user scans QR code, extract `machine_id` and call:

```
GET /api/machines/by-code/CNC-001
Authorization: Bearer <token>
```

Response:
```json
{
  "id": 1,
  "machine_id": "CNC-001",
  "machine_name": "CNC Lathe Machine",
  "machine_type": "CNC",
  "location": "Shop Floor A",
  "status": "OPERATIONAL",
  "health_status": "GREEN",
  "next_maintenance_date": "2024-02-15",
  "days_until_maintenance": 25
}
```

### 3. Log Reading for Scanned Machine

```
POST /api/readings/log/
Authorization: Bearer <token>

{
  "machine_id": "CNC-001",
  "temperature": 75.5,
  "vibration_level": 2.1,
  "oil_pressure": 45.0
}
```

## Frontend Flow

1. **Scan QR Code** → Get machine_id
2. **Fetch Machine Details** → `GET /api/machines/by-code/{machine_id}`
3. **Show Logging Form** → Pre-filled with machine info
4. **Submit Reading** → `POST /api/readings/log/`
5. **Show Success** → Reading logged

## Example QR Code Data

```json
{
  "machine_id": "CNC-001",
  "api_url": "/api/machines/by-code/CNC-001"
}
```

Frontend parses this and makes API call to get full machine details.
