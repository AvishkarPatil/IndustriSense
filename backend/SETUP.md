# Setup

## 1. Install
```bash
pip install -r requirements.txt
```

## 2. Database
```sql
CREATE DATABASE factory_maintenance_db;
```

## 3. Migrate
```bash
python manage.py migrate
```

## 4. Load Sample Data (Optional)
```bash
python load_sample_data.py
```
Creates:
- 3 users: admin, supervisor, tech (password: pass)
- 5 machines (CNC, Injection Molding, Conveyor)
- 5 spare parts (2 low stock)
- 3 work orders
- 15 machine readings

## 5. Run
```bash
python manage.py runserver
```

## 6. Test
```bash
python test_api.py
```

## Access
- API: http://localhost:8000/api/
- Admin: http://localhost:8000/admin/

## Endpoints
```
POST /api/auth/register/
POST /api/auth/login/
GET  /api/machines/
POST /api/machines/
GET  /api/machines/{id}/qr/
GET  /api/machines/{id}/report/
GET  /api/machines/dashboard/
POST /api/readings/log/
POST /api/work-orders/
GET  /api/parts/low-stock/
GET  /api/analytics/dashboard/
GET  /api/analytics/notifications/
```
