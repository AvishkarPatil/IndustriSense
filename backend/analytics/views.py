from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Sum, F
from django.utils import timezone
from machines.models import Machine
from maintenance.models import WorkOrder, SparePart

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_overview(request):
    machines = Machine.objects.all()
    work_orders = WorkOrder.objects.all()
    
    health_counts = {'green': 0, 'yellow': 0, 'red': 0, 'critical': 0}
    
    for machine in machines:
        status = machine.get_health_status()
        if status == 'GREEN':
            health_counts['green'] += 1
        elif status == 'YELLOW':
            health_counts['yellow'] += 1
        elif status == 'RED':
            health_counts['red'] += 1
        elif status == 'CRITICAL':
            health_counts['critical'] += 1
    
    return Response({
        'total_machines': machines.count(),
        'operational': machines.filter(status='OPERATIONAL').count(),
        'under_maintenance': machines.filter(status='UNDER_MAINTENANCE').count(),
        'down': machines.filter(status='DOWN').count(),
        'health_status': health_counts,
        'pending_work_orders': work_orders.filter(status='PENDING').count(),
        'in_progress_work_orders': work_orders.filter(status='IN_PROGRESS').count(),
        'completed_work_orders': work_orders.filter(status='COMPLETED').count(),
        'low_stock_parts': SparePart.objects.filter(quantity_in_stock__lte=F('minimum_stock_level')).count(),
    })
