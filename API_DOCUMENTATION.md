# IndustriSense API Documentation

Complete REST API reference for IndustriSense factory maintenance platform.

**Base URL**: `http://localhost:8000/api`

## Table of Contents

- [Authentication](#authentication)
- [Machines](#machines)
- [Readings](#readings)
- [Work Orders](#work-orders)
- [Spare Parts](#spare-parts)
- [Analytics](#analytics)
- [Error Handling](#error-handling)

## Authentication

All API endpoints (except login/register) require JWT authentication.

### Register User

```http
POST /auth/register/
```

**Request Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "password2": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "role": "TECHNICIAN",
  "phone_number": "+1234567890",
  "factory_location": "Plant A"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "TECHNICIAN"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Login

```http
POST /auth/login/
```

**Request Body**:
```json
{
  "username": "admin",
  "password": "HueHueHue#69"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@mail.com",
    "role": "ADMIN"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Get Profile

```http
GET /auth/profile/
Authorization: Bearer {access_token}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@mail.com",
  "first_name": "Avishkar",
  "last_name": "Patil",
  "role": "ADMIN",
  "phone_number": "",
  "factory_location": "",
  "date_joined": "2025-01-15T10:30:00Z"
}
```

### Update Profile

```http
PUT /auth/profile/update/
Authorization: Bearer {access_token}
```

**Request Body**:
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "phone_number": "+1234567890",
  "factory_location": "Plant B"
}
```

## Machines

### List Machines

```http
GET /machines/
Authorization: Bearer {access_token}
```

**Query Parameters**:
- `status`: Filter by status (OPERATIONAL, UNDER_MAINTENANCE, DOWN)
- `machine_type`: Filter by type
- `location`: Filter by location
- `search`: Search by machine_id or machine_name

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "machine_id": "CNC-001",
    "machine_name": "CNC Lathe Machine",
    "machine_type": "CNC",
    "location": "Shop Floor A",
    "status": "OPERATIONAL",
    "health_status": "GREEN",
    "next_maintenance_date": "2025-02-15",
    "days_until_maintenance": 25
  }
]
```

### Get Machine Details

```http
GET /machines/{id}/
Authorization: Bearer {access_token}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "machine_id": "CNC-001",
  "machine_name": "CNC Lathe Machine",
  "machine_type": "CNC",
  "manufacturer": "Haas Automation",
  "model_number": "ST-20",
  "location": "Shop Floor A",
  "installation_date": "2020-01-15",
  "warranty_expiry": "2025-01-15",
  "status": "OPERATIONAL",
  "maintenance_frequency_days": 30,
  "last_maintenance_date": "2025-01-10",
  "next_maintenance_date": "2025-02-09",
  "specifications": {},
  "health_status": "GREEN",
  "days_until_maintenance": 25,
  "latest_reading": {
    "temperature": 72.5,
    "vibration_level": 2.1,
    "oil_pressure": 42.0,
    "timestamp": "2025-01-15T14:30:00Z"
  }
}
```

### Create Machine

```http
POST /machines/
Authorization: Bearer {access_token}
```

**Request Body**:
```json
{
  "machine_id": "CNC-003",
  "machine_name": "CNC Milling Machine",
  "machine_type": "CNC",
  "manufacturer": "Haas",
  "model_number": "VF-2",
  "location": "Shop Floor A",
  "installation_date": "2024-01-15",
  "warranty_expiry": "2029-01-15",
  "status": "OPERATIONAL",
  "maintenance_frequency_days": 30,
  "last_maintenance_date": "2025-01-01"
}
```

### Get Machine Health Score

```http
GET /machines/{id}/health-score/
Authorization: Bearer {access_token}
```

**Response** (200 OK):
```json
{
  "machine_id": "CNC-001",
  "machine_name": "CNC Lathe Machine",
  "health_score": 87,
  "status": "HEALTHY",
  "message": "Machine operating normally",
  "trend": "IMPROVING",
  "scheduled_maintenance": "2025-02-09",
  "predicted_maintenance": "2025-02-09",
  "days_until_predicted": 30,
  "readings_analyzed": 45,
  "anomalies_detected": 2
}
```

### Generate QR Code

```http
GET /machines/{id}/qr/
Authorization: Bearer {access_token}
```

**Response** (200 OK):
```json
{
  "qr_code_url": "/media/qr_codes/qr_CNC-001.png",
  "machine_id": "CNC-001",
  "machine_name": "CNC Lathe Machine"
}
```

### Download PDF Report

```http
GET /machines/{id}/report/
Authorization: Bearer {access_token}
```

**Response**: PDF file download

### Get Machine by Code

```http
GET /machines/by-code/{machine_code}/
Authorization: Bearer {access_token}
```

### Dashboard Overview

```http
GET /machines/dashboard/
Authorization: Bearer {access_token}
```

**Response** (200 OK):
```json
{
  "machines": [
    {
      "id": 1,
      "machine_id": "CNC-001",
      "machine_name": "CNC Lathe Machine",
      "health_status": "GREEN",
      "days_until_maintenance": 25
    }
  ],
  "summary": {
    "total_machines": 5,
    "operational": 4,
    "under_maintenance": 1,
    "down": 0
  }
}
```

## Readings

### List Readings

```http
GET /readings/
Authorization: Bearer {access_token}
```

**Query Parameters**:
- `machine`: Filter by machine ID
- `is_anomaly`: Filter anomalies (true/false)
- `logged_by`: Filter by user ID

### Log Reading

```http
POST /readings/log/
Authorization: Bearer {access_token}
```

**Request Body**:
```json
{
  "machine_id": "CNC-001",
  "temperature": 75.5,
  "vibration_level": 2.3,
  "oil_pressure": 45.0,
  "runtime_hours": 1250,
  "notes": "Normal operation",
  "inspection_photo": null
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "machine": 1,
  "logged_by": 1,
  "timestamp": "2025-01-15T14:30:00Z",
  "temperature": 75.5,
  "vibration_level": 2.3,
  "oil_pressure": 45.0,
  "runtime_hours": 1250,
  "is_anomaly": false,
  "anomaly_reason": "",
  "notes": "Normal operation"
}
```

### Bulk Log Readings

```http
POST /readings/bulk/
Authorization: Bearer {access_token}
```

**Request Body**:
```json
{
  "readings": [
    {
      "machine_id": "CNC-001",
      "temperature": 75.5,
      "vibration_level": 2.3
    },
    {
      "machine_id": "CNC-002",
      "temperature": 72.0,
      "vibration_level": 1.8
    }
  ]
}
```

## Work Orders

### List Work Orders

```http
GET /work-orders/
Authorization: Bearer {access_token}
```

**Query Parameters**:
- `status`: Filter by status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- `priority`: Filter by priority (LOW, MEDIUM, HIGH, CRITICAL)
- `assigned_to`: Filter by technician ID
- `machine`: Filter by machine ID

### Create Work Order

```http
POST /work-orders/
Authorization: Bearer {access_token}
```

**Request Body**:
```json
{
  "work_order_id": "WO-004",
  "machine": 1,
  "title": "Routine Maintenance",
  "description": "Monthly inspection and oil change",
  "status": "PENDING",
  "priority": "MEDIUM",
  "assigned_to": 3,
  "scheduled_date": "2025-02-01"
}
```

### Start Work Order

```http
POST /work-orders/{id}/start/
Authorization: Bearer {access_token}
```

**Response** (200 OK):
```json
{
  "message": "Work order started",
  "status": "IN_PROGRESS"
}
```

### Complete Work Order

```http
POST /work-orders/{id}/complete/
Authorization: Bearer {access_token}
```

**Request Body**:
```json
{
  "completion_notes": "Replaced oil filter and checked all systems",
  "labor_hours": 2.5,
  "labor_cost": 500
}
```

## Spare Parts

### List Spare Parts

```http
GET /parts/
Authorization: Bearer {access_token}
```

### Get Low Stock Parts

```http
GET /parts/low-stock/
Authorization: Bearer {access_token}
```

**Response** (200 OK):
```json
[
  {
    "id": 2,
    "part_id": "OIL-001",
    "part_name": "Hydraulic Oil",
    "quantity_in_stock": 3,
    "minimum_stock_level": 5,
    "unit_cost": "150.00",
    "is_low_stock": true
  }
]
```

### Restock Part

```http
POST /parts/{id}/restock/
Authorization: Bearer {access_token}
```

**Request Body**:
```json
{
  "quantity": 10
}
```

## Analytics

### Dashboard Overview

```http
GET /analytics/dashboard/
Authorization: Bearer {access_token}
```

**Response** (200 OK):
```json
{
  "total_machines": 5,
  "operational": 4,
  "under_maintenance": 1,
  "down": 0,
  "health_status": {
    "green": 3,
    "yellow": 1,
    "red": 0,
    "critical": 1
  },
  "pending_work_orders": 2,
  "in_progress_work_orders": 1,
  "completed_work_orders": 15,
  "low_stock_parts": 2
}
```

### Get Notifications

```http
GET /analytics/notifications/
Authorization: Bearer {access_token}
```

**Response** (200 OK):
```json
{
  "total": 5,
  "critical": 1,
  "high": 1,
  "medium": 3,
  "notifications": [
    {
      "type": "ANOMALY_DETECTED",
      "severity": "CRITICAL",
      "title": "Anomaly Detected: CNC-001",
      "message": "Temperature anomaly: 95.0°C (normal: 72.5±3.2)",
      "machine_id": "CNC-001",
      "timestamp": "2025-01-15T14:30:00Z"
    }
  ]
}
```

## Error Handling

### Error Response Format

```json
{
  "error": "Error message",
  "detail": "Detailed error description"
}
```

### HTTP Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Common Errors

**Invalid Credentials**:
```json
{
  "error": "Invalid credentials"
}
```

**Validation Error**:
```json
{
  "machine_id": ["This field is required."],
  "temperature": ["Ensure this value is greater than or equal to 0."]
}
```

**Permission Denied**:
```json
{
  "detail": "You do not have permission to perform this action."
}
```
