# Testing Checklist

## 1. API Root (No Auth)
```
GET http://localhost:8000/api/
```
✅ Should show all endpoints

## 2. Login
```
POST http://localhost:8000/api/auth/login/
{
  "username": "admin",
  "password": "pass"
}
```
✅ Copy the `access` token

## 3. Dashboard
```
GET http://localhost:8000/api/machines/dashboard/
Authorization: Bearer <token>
```
✅ Should show 5 machines with health status

## 4. Notifications
```
GET http://localhost:8000/api/analytics/notifications/
Authorization: Bearer <token>
```
✅ Should show alerts (low stock, upcoming maintenance)

## 5. Get Machine by QR Code
```
GET http://localhost:8000/api/machines/by-code/CNC-001/
Authorization: Bearer <token>
```
✅ Should return machine details

## 6. Generate QR Code
```
GET http://localhost:8000/api/machines/1/qr/
Authorization: Bearer <token>
```
✅ Should generate QR code image

## 7. Log Reading
```
POST http://localhost:8000/api/readings/log/
Authorization: Bearer <token>
{
  "machine_id": "CNC-001",
  "temperature": 85.0,
  "vibration_level": 3.5,
  "oil_pressure": 42.0
}
```
✅ Should log reading (check is_anomaly)

## 8. PDF Report
```
GET http://localhost:8000/api/machines/1/report/
Authorization: Bearer <token>
```
✅ Should download PDF

## 9. Low Stock Parts
```
GET http://localhost:8000/api/parts/low-stock/
Authorization: Bearer <token>
```
✅ Should show 2 parts (Hydraulic Oil, Drive Belt)

## 10. Work Orders
```
GET http://localhost:8000/api/work-orders/
Authorization: Bearer <token>
```
✅ Should show 3 work orders

## Quick Test (Browser)
1. Open: http://localhost:8000/api/
2. Browse all endpoints
3. Click on endpoints to test

## Admin Panel
1. Open: http://localhost:8000/admin/
2. Login: admin / pass
3. View all data tables

## Expected Data
- 5 Machines (CNC-001, CNC-002, INJ-001, INJ-002, CONV-001)
- 15 Readings
- 5 Spare Parts (2 low stock)
- 3 Work Orders
- 3 Users (admin, supervisor, tech)
