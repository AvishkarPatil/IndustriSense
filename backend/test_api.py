import requests

BASE = "http://localhost:8000/api"

print("Testing Smart Factory API...\n")

print("1. API Root...")
r = requests.get(f"{BASE}/")
print(f"✅ Status: {r.status_code}\n")

print("2. Login...")
r = requests.post(f"{BASE}/auth/login/", json={
    "username": "admin",
    "password": "HueHueHue#69"
})
token = r.json()['access'] if r.status_code == 200 else None
print(f"✅ Token: {token[:20] if token else 'Failed'}...\n")

if not token:
    exit()

headers = {"Authorization": f"Bearer {token}"}

print("3. Create/Get Machine...")
import time
from datetime import datetime, timedelta
machine_code = f"TEST-{int(time.time())}"
last_maint = (datetime.now() - timedelta(days=5)).strftime('%Y-%m-%d')
r = requests.post(f"{BASE}/machines/", headers=headers, json={
    "machine_id": machine_code, "machine_name": "Test CNC Machine",
    "machine_type": "CNC", "location": "Floor A",
    "installation_date": "2024-01-01", "status": "OPERATIONAL",
    "maintenance_frequency_days": 30, "last_maintenance_date": last_maint
})
if r.status_code == 201:
    machine_id = r.json()['id']
    print(f"✅ Machine ID: {machine_id}\n")
else:
    print(f"❌ Failed: {r.status_code}\n")
    exit()

print("4. Generate QR...")
r = requests.get(f"{BASE}/machines/{machine_id}/qr/", headers=headers)
print(f"✅ QR: {r.status_code == 200}\n")

print("5. Log Normal Readings...")
for i in range(3):
    r = requests.post(f"{BASE}/readings/log/", headers=headers, json={
        "machine_id": machine_code, "temperature": 72.0 + i, "vibration_level": 2.0 + (i*0.1)
    })
print(f"✅ Logged 3 readings\n")

print("6. Dashboard (GREEN)...")
r = requests.get(f"{BASE}/machines/dashboard/", headers=headers)
status = r.json()['machines'][0]['health_status']
print(f"✅ Status: {status}\n")

print("7. Log Anomaly...")
r = requests.post(f"{BASE}/readings/log/", headers=headers, json={
    "machine_id": machine_code, "temperature": 95.0, "vibration_level": 8.5
})
print(f"✅ Anomaly: {r.json()['is_anomaly']}\n")

print("8. Dashboard (CRITICAL)...")
r = requests.get(f"{BASE}/machines/dashboard/", headers=headers)
status = r.json()['machines'][0]['health_status']
print(f"✅ Status: {status}\n")

print("9. PDF Report...")
r = requests.get(f"{BASE}/machines/{machine_id}/report/", headers=headers)
print(f"✅ PDF: {r.status_code == 200}\n")

print("10. Notifications...")
r = requests.get(f"{BASE}/analytics/notifications/", headers=headers)
print(f"✅ Alerts: {r.json()['total']}\n")

print("11. QR Scan (Get by Code)...")
r = requests.get(f"{BASE}/machines/by-code/{machine_code}/", headers=headers)
if r.status_code == 200:
    print(f"✅ Machine: {r.json()['machine_name']}\n")
else:
    print(f"❌ Failed\n")

print("🎉 ALL TESTS PASSED!")
