from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.http import HttpResponse
from datetime import timedelta
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO
from .models import Machine, MachineReading
from .serializers import MachineSerializer, MachineListSerializer, MachineReadingSerializer
from .utils import generate_qr_code, detect_anomaly

class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.select_related('created_by').prefetch_related('readings')
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'machine_type', 'location']
    search_fields = ['machine_id', 'machine_name', 'manufacturer']
    ordering_fields = ['next_maintenance_date', 'installation_date', 'machine_id']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return MachineListSerializer
        return MachineSerializer
    
    def perform_create(self, serializer):
        machine = serializer.save(created_by=self.request.user)
        if machine.last_maintenance_date and not machine.next_maintenance_date:
            machine.calculate_next_maintenance()
    
    @action(detail=True, methods=['get'], url_path='qr')
    def generate_qr(self, request, pk=None):
        machine = self.get_object()
        qr_url = generate_qr_code(machine)
        return Response({
            'qr_code_url': qr_url,
            'machine_id': machine.machine_id,
            'machine_name': machine.machine_name
        })
    
    @action(detail=True, methods=['get'], url_path='report')
    def pdf_report(self, request, pk=None):
        machine = self.get_object()
        
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        elements = []
        styles = getSampleStyleSheet()
        
        elements.append(Paragraph(f"<b>Machine Maintenance Report</b>", styles['Title']))
        elements.append(Spacer(1, 0.3*inch))
        
        machine_data = [
            ['Machine ID:', machine.machine_id],
            ['Machine Name:', machine.machine_name],
            ['Type:', machine.machine_type],
            ['Location:', machine.location],
            ['Status:', machine.status],
            ['Health Status:', machine.get_health_status()],
            ['Last Maintenance:', str(machine.last_maintenance_date) if machine.last_maintenance_date else 'N/A'],
            ['Next Maintenance:', str(machine.next_maintenance_date) if machine.next_maintenance_date else 'N/A'],
        ]
        
        machine_table = Table(machine_data, colWidths=[2*inch, 4*inch])
        machine_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        elements.append(machine_table)
        elements.append(Spacer(1, 0.3*inch))
        
        elements.append(Paragraph("<b>Recent Readings (Last 10)</b>", styles['Heading2']))
        elements.append(Spacer(1, 0.2*inch))
        
        readings = machine.readings.all()[:10]
        if readings:
            reading_data = [['Date', 'Temp (°C)', 'Vibration', 'Oil Pressure', 'Anomaly']]
            for reading in readings:
                reading_data.append([
                    reading.timestamp.strftime('%Y-%m-%d %H:%M'),
                    str(reading.temperature) if reading.temperature else 'N/A',
                    str(reading.vibration_level) if reading.vibration_level else 'N/A',
                    str(reading.oil_pressure) if reading.oil_pressure else 'N/A',
                    'YES' if reading.is_anomaly else 'NO'
                ])
            
            reading_table = Table(reading_data, colWidths=[1.5*inch, 1*inch, 1*inch, 1.2*inch, 0.8*inch])
            reading_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            elements.append(reading_table)
        else:
            elements.append(Paragraph("No readings available", styles['Normal']))
        
        elements.append(Spacer(1, 0.3*inch))
        elements.append(Paragraph("<b>Maintenance History (Last 5)</b>", styles['Heading2']))
        elements.append(Spacer(1, 0.2*inch))
        
        work_orders = machine.work_orders.filter(status='COMPLETED').order_by('-completed_at')[:5]
        if work_orders:
            wo_data = [['Work Order', 'Date', 'Labor Cost', 'Parts Cost', 'Total']]
            for wo in work_orders:
                wo_data.append([
                    wo.work_order_id,
                    wo.completed_at.strftime('%Y-%m-%d') if wo.completed_at else 'N/A',
                    f"₹{wo.labor_cost}",
                    f"₹{wo.parts_cost}",
                    f"₹{wo.total_cost}"
                ])
            
            wo_table = Table(wo_data, colWidths=[1.5*inch, 1.2*inch, 1.2*inch, 1.2*inch, 1.2*inch])
            wo_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            elements.append(wo_table)
        else:
            elements.append(Paragraph("No maintenance history available", styles['Normal']))
        
        doc.build(elements)
        buffer.seek(0)
        
        response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{machine.machine_id}_report.pdf"'
        return response
    
    @action(detail=True, methods=['get'], url_path='health')
    def health_status(self, request, pk=None):
        machine = self.get_object()
        days_until = None
        if machine.next_maintenance_date:
            days_until = (machine.next_maintenance_date - timezone.now().date()).days
        
        latest_reading = machine.readings.first()
        
        return Response({
            'machine_id': machine.machine_id,
            'machine_name': machine.machine_name,
            'status': machine.status,
            'health_status': machine.get_health_status(),
            'days_until_maintenance': days_until,
            'next_maintenance_date': machine.next_maintenance_date,
            'latest_reading': MachineReadingSerializer(latest_reading).data if latest_reading else None,
            'recent_anomalies': machine.readings.filter(is_anomaly=True).count()
        })
    
    @action(detail=True, methods=['get'], url_path='health-score')
    def health_score(self, request, pk=None):
        from sklearn.ensemble import IsolationForest
        import numpy as np
        
        machine = self.get_object()
        
        thirty_days_ago = timezone.now() - timedelta(days=30)
        readings = machine.readings.filter(timestamp__gte=thirty_days_ago).order_by('timestamp')
        
        if readings.count() < 10:
            return Response({
                'machine_id': machine.machine_id,
                'health_score': None,
                'status': 'INSUFFICIENT_DATA',
                'message': 'Need at least 10 readings for analysis',
                'readings_count': readings.count()
            })
        
        X = []
        for r in readings:
            X.append([r.temperature or 0, r.vibration_level or 0, r.oil_pressure or 0])
        
        X = np.array(X)
        
        model = IsolationForest(contamination=0.1, random_state=42)
        model.fit(X)
        
        scores = model.decision_function(X)
        latest_score = scores[-1]
        
        min_score, max_score = scores.min(), scores.max()
        health_score = int(((latest_score - min_score) / (max_score - min_score)) * 100) if max_score != min_score else 100
        
        if health_score < 60:
            status = 'CRITICAL'
            message = 'Immediate maintenance recommended'
            predicted_days = 3
        elif health_score < 80:
            status = 'WARNING'
            message = 'Schedule maintenance soon'
            predicted_days = 7
        else:
            status = 'HEALTHY'
            message = 'Machine operating normally'
            predicted_days = machine.maintenance_frequency_days if machine.next_maintenance_date else 30
        
        mid = len(scores) // 2
        trend = 'IMPROVING' if np.mean(scores[mid:]) > np.mean(scores[:mid]) else 'DECLINING'
        
        predicted_maintenance = timezone.now().date() + timedelta(days=predicted_days)
        
        return Response({
            'machine_id': machine.machine_id,
            'machine_name': machine.machine_name,
            'health_score': health_score,
            'status': status,
            'message': message,
            'trend': trend,
            'scheduled_maintenance': machine.next_maintenance_date,
            'predicted_maintenance': predicted_maintenance,
            'days_until_predicted': predicted_days,
            'readings_analyzed': readings.count(),
            'anomalies_detected': int((model.predict(X) == -1).sum())
        })
    
    @action(detail=False, methods=['get'], url_path='by-code/(?P<machine_code>[^/.]+)')
    def get_by_code(self, request, machine_code=None):
        try:
            machine = Machine.objects.get(machine_id=machine_code)
            serializer = self.get_serializer(machine)
            return Response(serializer.data)
        except Machine.DoesNotExist:
            return Response({'error': 'Machine not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        machines = self.get_queryset()
        
        dashboard_data = []
        for machine in machines:
            dashboard_data.append({
                'id': machine.id,
                'machine_id': machine.machine_id,
                'machine_name': machine.machine_name,
                'machine_type': machine.machine_type,
                'location': machine.location,
                'status': machine.status,
                'health_status': machine.get_health_status(),
                'next_maintenance_date': machine.next_maintenance_date,
                'days_until_maintenance': (machine.next_maintenance_date - timezone.now().date()).days if machine.next_maintenance_date else None,
            })
        
        summary = {
            'total_machines': machines.count(),
            'operational': machines.filter(status='OPERATIONAL').count(),
            'under_maintenance': machines.filter(status='UNDER_MAINTENANCE').count(),
            'down': machines.filter(status='DOWN').count(),
        }
        
        return Response({
            'machines': dashboard_data,
            'summary': summary
        })

class MachineReadingViewSet(viewsets.ModelViewSet):
    queryset = MachineReading.objects.select_related('machine', 'logged_by')
    serializer_class = MachineReadingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['machine', 'is_anomaly', 'logged_by']
    ordering_fields = ['timestamp']
    
    def perform_create(self, serializer):
        machine = serializer.validated_data['machine']
        
        reading_data = {
            'temperature': serializer.validated_data.get('temperature'),
            'vibration_level': serializer.validated_data.get('vibration_level'),
            'oil_pressure': serializer.validated_data.get('oil_pressure'),
        }
        
        is_anomaly, anomaly_reason = detect_anomaly(machine, reading_data)
        
        serializer.save(
            logged_by=self.request.user,
            is_anomaly=is_anomaly,
            anomaly_reason=anomaly_reason
        )
    
    @action(detail=False, methods=['post'], url_path='log')
    def log_reading(self, request):
        machine_id = request.data.get('machine_id')
        
        try:
            machine = Machine.objects.get(machine_id=machine_id)
        except Machine.DoesNotExist:
            return Response({'error': 'Machine not found'}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data.copy()
        data['machine'] = machine.id
        
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='bulk')
    def bulk_log(self, request):
        readings_data = request.data.get('readings', [])
        created_readings = []
        errors = []
        
        for reading_data in readings_data:
            machine_id = reading_data.get('machine_id')
            try:
                machine = Machine.objects.get(machine_id=machine_id)
                reading_data['machine'] = machine.id
                
                serializer = self.get_serializer(data=reading_data)
                if serializer.is_valid():
                    self.perform_create(serializer)
                    created_readings.append(serializer.data)
                else:
                    errors.append({'machine_id': machine_id, 'errors': serializer.errors})
            except Machine.DoesNotExist:
                errors.append({'machine_id': machine_id, 'error': 'Machine not found'})
        
        return Response({
            'created': len(created_readings),
            'failed': len(errors),
            'readings': created_readings,
            'errors': errors
        }, status=status.HTTP_201_CREATED if created_readings else status.HTTP_400_BAD_REQUEST)
