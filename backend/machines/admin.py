from django.contrib import admin
from .models import Machine, MachineReading

@admin.register(Machine)
class MachineAdmin(admin.ModelAdmin):
    list_display = ['machine_id', 'machine_name', 'machine_type', 'location', 'status', 
                    'next_maintenance_date', 'get_health_status']
    list_filter = ['status', 'machine_type', 'location']
    search_fields = ['machine_id', 'machine_name', 'manufacturer']
    readonly_fields = ['created_at', 'updated_at', 'created_by']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('machine_id', 'machine_name', 'machine_type', 'manufacturer', 'model_number')
        }),
        ('Location & Status', {
            'fields': ('location', 'status', 'installation_date', 'warranty_expiry')
        }),
        ('Maintenance', {
            'fields': ('maintenance_frequency_days', 'last_maintenance_date', 'next_maintenance_date')
        }),
        ('Additional', {
            'fields': ('specifications', 'manual_document', 'machine_photo', 'qr_code')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(MachineReading)
class MachineReadingAdmin(admin.ModelAdmin):
    list_display = ['machine', 'timestamp', 'temperature', 'vibration_level', 
                    'oil_pressure', 'is_anomaly', 'logged_by']
    list_filter = ['is_anomaly', 'machine', 'timestamp']
    search_fields = ['machine__machine_id', 'notes']
    readonly_fields = ['timestamp', 'logged_by']
    date_hierarchy = 'timestamp'


