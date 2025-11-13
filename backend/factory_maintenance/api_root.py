from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.reverse import reverse

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request, format=None):
    return Response({
        'name': 'Smart Factory Maintenance Tracker API',
        'version': '1.0',
        'endpoints': {
            'auth': {
                'register': '/api/auth/register/',
                'login': '/api/auth/login/',
                'profile': '/api/auth/profile/',
            },
            'machines': {
                'list': '/api/machines/',
                'create': 'POST /api/machines/',
                'detail': '/api/machines/{id}/',
                'by_code': '/api/machines/by-code/{machine_id}/',
                'qr_code': '/api/machines/{id}/qr/',
                'health': '/api/machines/{id}/health/',
                'health_score': '/api/machines/{id}/health-score/',
                'report': '/api/machines/{id}/report/',
                'dashboard': '/api/machines/dashboard/',
            },
            'readings': {
                'list': '/api/readings/',
                'log': 'POST /api/readings/log/',
                'bulk': 'POST /api/readings/bulk/',
            },
            'work_orders': {
                'list': '/api/work-orders/',
                'create': 'POST /api/work-orders/',
                'start': 'POST /api/work-orders/{id}/start/',
                'complete': 'POST /api/work-orders/{id}/complete/',
            },
            'parts': {
                'list': '/api/parts/',
                'low_stock': '/api/parts/low-stock/',
                'restock': 'POST /api/parts/{id}/restock/',
            },
            'analytics': {
                'dashboard': '/api/analytics/dashboard/',
                'notifications': '/api/analytics/notifications/',
            }
        }
    })
