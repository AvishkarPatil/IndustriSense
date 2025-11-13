from django.db import models
from django.utils import timezone
from datetime import timedelta
from authentication.models import CustomUser

class Machine(models.Model):
    STATUS_CHOICES = [
        ('OPERATIONAL', 'Operational'),
        ('UNDER_MAINTENANCE', 'Under Maintenance'),
        ('DOWN', 'Down'),
        ('DECOMMISSIONED', 'Decommissioned'),
    ]
    
    machine_id = models.CharField(max_length=50, unique=True, db_index=True)
    machine_name = models.CharField(max_length=100)
    machine_type = models.CharField(max_length=100)
    manufacturer = models.CharField(max_length=100, blank=True)
    model_number = models.CharField(max_length=100, blank=True)
    
    location = models.CharField(max_length=100)
    installation_date = models.DateField()
    warranty_expiry = models.DateField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPERATIONAL')
    
    maintenance_frequency_days = models.IntegerField(help_text="Maintenance due every X days")
    last_maintenance_date = models.DateField(null=True, blank=True)
    next_maintenance_date = models.DateField(null=True, blank=True, db_index=True)
    
    specifications = models.JSONField(default=dict, blank=True)
    
    manual_document = models.FileField(upload_to='machine_manuals/', null=True, blank=True)
    machine_photo = models.ImageField(upload_to='machine_photos/', null=True, blank=True)
    qr_code = models.ImageField(upload_to='qr_codes/', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='created_machines')
    
    class Meta:
        db_table = 'machines'
        ordering = ['machine_id']
        indexes = [
            models.Index(fields=['machine_id']),
            models.Index(fields=['next_maintenance_date']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.machine_id} - {self.machine_name}"
    
    def calculate_next_maintenance(self):
        if self.last_maintenance_date:
            self.next_maintenance_date = self.last_maintenance_date + timedelta(days=self.maintenance_frequency_days)
            self.save(update_fields=['next_maintenance_date'])
    
    def get_health_status(self):
        if not self.next_maintenance_date:
            return 'UNKNOWN'
        
        today = timezone.now().date()
        days_until = (self.next_maintenance_date - today).days
        
        if self.readings.filter(is_anomaly=True, timestamp__gte=timezone.now() - timedelta(days=7)).exists():
            return 'CRITICAL'
        
        if days_until < 0:
            return 'RED'
        elif days_until <= 7:
            return 'YELLOW'
        else:
            return 'GREEN'

class MachineReading(models.Model):
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, related_name='readings')
    logged_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    
    temperature = models.FloatField(null=True, blank=True)
    vibration_level = models.FloatField(null=True, blank=True)
    oil_pressure = models.FloatField(null=True, blank=True)
    runtime_hours = models.IntegerField(null=True, blank=True)
    
    custom_readings = models.JSONField(default=dict, blank=True)
    
    inspection_photo = models.ImageField(upload_to='inspection_photos/', null=True, blank=True)
    notes = models.TextField(blank=True)
    
    is_anomaly = models.BooleanField(default=False, db_index=True)
    anomaly_reason = models.TextField(blank=True)
    
    class Meta:
        db_table = 'machine_readings'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['-timestamp']),
            models.Index(fields=['machine', '-timestamp']),
            models.Index(fields=['is_anomaly']),
        ]
    
    def __str__(self):
        return f"{self.machine.machine_id} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
