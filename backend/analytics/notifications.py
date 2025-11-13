from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from machines.models import Machine, MachineReading
from maintenance.models import SparePart, WorkOrder
from django.db.models import F

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    notifications = []
    
    today = timezone.now().date()
    
    overdue_machines = Machine.objects.filter(
        next_maintenance_date__lt=today
    ).values('id', 'machine_id', 'machine_name', 'next_maintenance_date')
    
    for machine in overdue_machines:
        days_overdue = (today - machine['next_maintenance_date']).days
        notifications.append({
            'type': 'OVERDUE_MAINTENANCE',
            'severity': 'HIGH',
            'title': f"Maintenance Overdue: {machine['machine_id']}",
            'message': f"{machine['machine_name']} is {days_overdue} days overdue for maintenance",
            'machine_id': machine['machine_id'],
            'timestamp': timezone.now().isoformat()
        })
    
    upcoming_machines = Machine.objects.filter(
        next_maintenance_date__gte=today,
        next_maintenance_date__lte=today + timedelta(days=3)
    ).values('id', 'machine_id', 'machine_name', 'next_maintenance_date')
    
    for machine in upcoming_machines:
        days_until = (machine['next_maintenance_date'] - today).days
        notifications.append({
            'type': 'UPCOMING_MAINTENANCE',
            'severity': 'MEDIUM',
            'title': f"Maintenance Due Soon: {machine['machine_id']}",
            'message': f"{machine['machine_name']} maintenance due in {days_until} days",
            'machine_id': machine['machine_id'],
            'timestamp': timezone.now().isoformat()
        })
    
    recent_anomalies = MachineReading.objects.filter(
        is_anomaly=True,
        timestamp__gte=timezone.now() - timedelta(hours=24)
    ).select_related('machine').values('machine__machine_id', 'machine__machine_name', 'anomaly_reason', 'timestamp')
    
    for anomaly in recent_anomalies:
        notifications.append({
            'type': 'ANOMALY_DETECTED',
            'severity': 'CRITICAL',
            'title': f"Anomaly Detected: {anomaly['machine__machine_id']}",
            'message': anomaly['anomaly_reason'],
            'machine_id': anomaly['machine__machine_id'],
            'timestamp': anomaly['timestamp'].isoformat()
        })
    
    low_stock_parts = SparePart.objects.filter(
        quantity_in_stock__lte=F('minimum_stock_level')
    ).values('part_id', 'part_name', 'quantity_in_stock', 'minimum_stock_level')
    
    for part in low_stock_parts:
        notifications.append({
            'type': 'LOW_STOCK',
            'severity': 'MEDIUM',
            'title': f"Low Stock: {part['part_name']}",
            'message': f"Stock level: {part['quantity_in_stock']} (Min: {part['minimum_stock_level']})",
            'part_id': part['part_id'],
            'timestamp': timezone.now().isoformat()
        })
    
    pending_work_orders = WorkOrder.objects.filter(
        status='PENDING',
        scheduled_date__lte=today
    ).values('work_order_id', 'machine__machine_id', 'title', 'scheduled_date')
    
    for wo in pending_work_orders:
        notifications.append({
            'type': 'PENDING_WORK_ORDER',
            'severity': 'MEDIUM',
            'title': f"Pending Work Order: {wo['work_order_id']}",
            'message': f"{wo['title']} for {wo['machine__machine_id']} scheduled on {wo['scheduled_date']}",
            'work_order_id': wo['work_order_id'],
            'timestamp': timezone.now().isoformat()
        })
    
    notifications.sort(key=lambda x: (
        {'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3}[x['severity']],
        x['timestamp']
    ), reverse=True)
    
    return Response({
        'total': len(notifications),
        'critical': len([n for n in notifications if n['severity'] == 'CRITICAL']),
        'high': len([n for n in notifications if n['severity'] == 'HIGH']),
        'medium': len([n for n in notifications if n['severity'] == 'MEDIUM']),
        'notifications': notifications
    })
