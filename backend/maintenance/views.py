from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db.models import F
from .models import WorkOrder, SparePart, SparePartUsage
from .serializers import (WorkOrderSerializer, WorkOrderListSerializer, 
                          SparePartSerializer, SparePartUsageSerializer)

class WorkOrderViewSet(viewsets.ModelViewSet):
    queryset = WorkOrder.objects.select_related('machine', 'assigned_to', 'created_by').prefetch_related('parts_used')
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'assigned_to', 'machine']
    search_fields = ['work_order_id', 'title', 'machine__machine_id']
    ordering_fields = ['scheduled_date', 'created_at', 'priority']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return WorkOrderListSerializer
        return WorkOrderSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'], url_path='start')
    def start_work(self, request, pk=None):
        work_order = self.get_object()
        if work_order.status != 'PENDING':
            return Response({'error': 'Work order already started or completed'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        work_order.status = 'IN_PROGRESS'
        work_order.started_at = timezone.now()
        work_order.save(update_fields=['status', 'started_at'])
        
        work_order.machine.status = 'UNDER_MAINTENANCE'
        work_order.machine.save(update_fields=['status'])
        
        return Response({'message': 'Work order started', 'status': work_order.status})
    
    @action(detail=True, methods=['post'], url_path='complete')
    def complete_work(self, request, pk=None):
        work_order = self.get_object()
        if work_order.status == 'COMPLETED':
            return Response({'error': 'Work order already completed'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        work_order.status = 'COMPLETED'
        work_order.completed_at = timezone.now()
        work_order.completion_notes = request.data.get('completion_notes', '')
        work_order.labor_hours = request.data.get('labor_hours', work_order.labor_hours)
        work_order.labor_cost = request.data.get('labor_cost', work_order.labor_cost)
        work_order.save()
        
        work_order.machine.status = 'OPERATIONAL'
        work_order.machine.last_maintenance_date = timezone.now().date()
        work_order.machine.save(update_fields=['status', 'last_maintenance_date'])
        work_order.machine.calculate_next_maintenance()
        
        return Response({'message': 'Work order completed', 'status': work_order.status})
    
    @action(detail=True, methods=['post'], url_path='parts')
    def add_parts(self, request, pk=None):
        work_order = self.get_object()
        parts_data = request.data.get('parts', [])
        
        created_parts = []
        for part_data in parts_data:
            part_data['work_order'] = work_order.id
            serializer = SparePartUsageSerializer(data=part_data)
            if serializer.is_valid():
                serializer.save()
                created_parts.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        work_order.parts_cost = sum([p['spare_part'].unit_cost * p['quantity_used'] 
                                     for p in SparePartUsage.objects.filter(work_order=work_order)
                                     .select_related('spare_part')])
        work_order.save(update_fields=['parts_cost'])
        
        return Response({'message': 'Parts added', 'parts': created_parts})

class SparePartViewSet(viewsets.ModelViewSet):
    queryset = SparePart.objects.prefetch_related('compatible_machines')
    serializer_class = SparePartSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['part_id', 'part_name', 'supplier_name']
    ordering_fields = ['part_name', 'quantity_in_stock', 'unit_cost']
    
    @action(detail=False, methods=['get'], url_path='low-stock')
    def low_stock(self, request):
        low_stock_parts = self.queryset.filter(quantity_in_stock__lte=F('minimum_stock_level'))
        serializer = self.get_serializer(low_stock_parts, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def restock(self, request, pk=None):
        spare_part = self.get_object()
        quantity = request.data.get('quantity', 0)
        
        if quantity <= 0:
            return Response({'error': 'Invalid quantity'}, status=status.HTTP_400_BAD_REQUEST)
        
        spare_part.quantity_in_stock += quantity
        spare_part.save(update_fields=['quantity_in_stock'])
        
        return Response({
            'message': 'Stock updated',
            'part_id': spare_part.part_id,
            'new_stock': spare_part.quantity_in_stock
        })
