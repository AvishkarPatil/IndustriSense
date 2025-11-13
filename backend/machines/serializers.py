from rest_framework import serializers
from .models import Machine, MachineReading
from django.utils import timezone

class MachineReadingSerializer(serializers.ModelSerializer):
    logged_by_username = serializers.CharField(source='logged_by.username', read_only=True)
    
    class Meta:
        model = MachineReading
        fields = '__all__'
        read_only_fields = ['logged_by', 'timestamp', 'is_anomaly', 'anomaly_reason']

class MachineSerializer(serializers.ModelSerializer):
    days_until_maintenance = serializers.SerializerMethodField()
    health_status = serializers.SerializerMethodField()
    latest_reading = serializers.SerializerMethodField()
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Machine
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at', 'updated_at', 'qr_code']
    
    def get_days_until_maintenance(self, obj):
        if obj.next_maintenance_date:
            return (obj.next_maintenance_date - timezone.now().date()).days
        return None
    
    def get_health_status(self, obj):
        return obj.get_health_status()
    
    def get_latest_reading(self, obj):
        latest = obj.readings.first()
        if latest:
            return MachineReadingSerializer(latest).data
        return None

class MachineListSerializer(serializers.ModelSerializer):
    days_until_maintenance = serializers.SerializerMethodField()
    health_status = serializers.SerializerMethodField()
    
    class Meta:
        model = Machine
        fields = ['id', 'machine_id', 'machine_name', 'machine_type', 'location', 
                  'status', 'next_maintenance_date', 'days_until_maintenance', 'health_status']
    
    def get_days_until_maintenance(self, obj):
        if obj.next_maintenance_date:
            return (obj.next_maintenance_date - timezone.now().date()).days
        return None
    
    def get_health_status(self, obj):
        return obj.get_health_status()
