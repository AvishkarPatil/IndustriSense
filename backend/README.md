# Smart Factory Maintenance Tracker - Backend

Production-ready Django REST API for factory maintenance management.

## Quick Setup

```bash
pip install -r requirements.txt
python manage.py migrate
python load_sample_data.py  # Load test data
python manage.py runserver
```

**Test Logins:**
- Admin: `admin` / `pass`
- Supervisor: `supervisor` / `pass`
- Technician: `tech` / `pass`

## API Endpoints

**Base URL**: `http://localhost:8000/api/`

### Authentication
- `POST /auth/register/` - Register user
- `POST /auth/login/` - Login (returns JWT token)
- `GET /auth/profile/` - Get user profile

### Machines
- `GET /machines/` - List machines
- `POST /machines/` - Create machine
- `GET /machines/{id}/` - Machine details
- `GET /machines/{id}/qr/` - Generate QR code
- `GET /machines/{id}/health-score/` - ML-based health prediction
- `GET /machines/{id}/report/` - Download PDF report
- `GET /machines/dashboard/` - Dashboard overview

### Readings
- `POST /readings/` - Log reading
- `POST /readings/bulk/` - Bulk log readings

### Work Orders
- `GET /work-orders/` - List work orders
- `POST /work-orders/` - Create work order
- `POST /work-orders/{id}/start/` - Start work
- `POST /work-orders/{id}/complete/` - Complete work

### Spare Parts
- `GET /parts/` - List spare parts
- `GET /parts/low-stock/` - Low stock alerts
- `POST /parts/{id}/restock/` - Restock

### Analytics
- `GET /analytics/dashboard/` - Overview stats
- `GET /analytics/notifications/` - Alerts

## Tech Stack

- Django 5.1 + PostgreSQL 17
- JWT Authentication
- Anomaly Detection (NumPy)
- PDF Reports (ReportLab)
- QR Code Generation

## Test

```bash
python test_api.py
```
