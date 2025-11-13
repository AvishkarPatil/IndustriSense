from rest_framework import serializers
from .models import WorkOrder, SparePart, SparePartUsage

class SparePartUsageSerializer(serializers.ModelSerializer):
    spare_part_name = serializers.CharField(source='spare_part.part_name', read_only=True)
    
    class Meta:
        model = SparePartUsage
        fields = '__all__'
        read_only_fields = ['recorded_at']

class WorkOrderSerializer(serializers.ModelSerializer):
    machine_name = serializers.CharField(source='machine.machine_name', read_only=True)
    machine_id = serializers.CharField(source='machine.machine_id', read_only=True)
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    parts_used = SparePartUsageSerializer(many=True, read_only=True)
    total_cost = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = WorkOrder
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at', 'updated_at', 'started_at', 'completed_at']

class WorkOrderListSerializer(serializers.ModelSerializer):
    machine_name = serializers.CharField(source='machine.machine_name', read_only=True)
    machine_id = serializers.CharField(source='machine.machine_id', read_only=True)
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)
    
    class Meta:
        model = WorkOrder
        fields = ['id', 'work_order_id', 'machine_id', 'machine_name', 'title', 
                  'status', 'priority', 'scheduled_date', 'assigned_to_username', 'created_at']

class SparePartSerializer(serializers.ModelSerializer):
    is_low_stock = serializers.BooleanField(read_only=True)
    compatible_machine_ids = serializers.SerializerMethodField()
    
    class Meta:
        model = SparePart
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def get_compatible_machine_ids(self, obj):
        return list(obj.compatible_machines.values_list('machine_id', flat=True))
