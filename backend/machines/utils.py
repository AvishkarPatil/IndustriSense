import qrcode
from io import BytesIO
from django.core.files import File
from django.conf import settings
import numpy as np
from datetime import timedelta
from django.utils import timezone

def generate_qr_code(machine):
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr_data = {
        'machine_id': machine.machine_id,
        'api_url': f'/api/machines/by-code/{machine.machine_id}'
    }
    import json
    qr.add_data(json.dumps(qr_data))
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    
    filename = f'qr_{machine.machine_id}.png'
    machine.qr_code.save(filename, File(buffer), save=True)
    return machine.qr_code.url

def detect_anomaly(machine, new_reading):
    recent_readings = machine.readings.filter(
        timestamp__gte=timezone.now() - timedelta(days=30),
        is_anomaly=False
    ).order_by('-timestamp')[:50]
    
    if recent_readings.count() < 3:
        return False, ""
    
    anomalies = []
    
    if new_reading.get('temperature'):
        temps = [r.temperature for r in recent_readings if r.temperature]
        if temps:
            mean_temp = np.mean(temps)
            std_temp = np.std(temps)
            if abs(new_reading['temperature'] - mean_temp) > 2 * std_temp:
                anomalies.append(f"Temperature anomaly: {new_reading['temperature']}°C (normal: {mean_temp:.1f}±{std_temp:.1f})")
    
    if new_reading.get('vibration_level'):
        vibs = [r.vibration_level for r in recent_readings if r.vibration_level]
        if vibs:
            mean_vib = np.mean(vibs)
            std_vib = np.std(vibs)
            if abs(new_reading['vibration_level'] - mean_vib) > 2 * std_vib:
                anomalies.append(f"Vibration anomaly: {new_reading['vibration_level']} (normal: {mean_vib:.1f}±{std_vib:.1f})")
    
    if new_reading.get('oil_pressure'):
        pressures = [r.oil_pressure for r in recent_readings if r.oil_pressure]
        if pressures:
            mean_pressure = np.mean(pressures)
            std_pressure = np.std(pressures)
            if abs(new_reading['oil_pressure'] - mean_pressure) > 2 * std_pressure:
                anomalies.append(f"Oil pressure anomaly: {new_reading['oil_pressure']} (normal: {mean_pressure:.1f}±{std_pressure:.1f})")
    
    if anomalies:
        return True, "; ".join(anomalies)
    
    return False, ""
