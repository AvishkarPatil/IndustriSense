from django.contrib import admin
from .models import WorkOrder, SparePart, SparePartUsage

class SparePartUsageInline(admin.TabularInline):
    model = SparePartUsage
    extra = 1

@admin.register(WorkOrder)
class WorkOrderAdmin(admin.ModelAdmin):
    list_display = ['work_order_id', 'machine', 'title', 'status', 'priority', 
                    'scheduled_date', 'assigned_to', 'total_cost']
    list_filter = ['status', 'priority', 'scheduled_date']
    search_fields = ['work_order_id', 'title', 'machine__machine_id']
    readonly_fields = ['created_by', 'created_at', 'updated_at', 'total_cost']
    inlines = [SparePartUsageInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('work_order_id', 'machine', 'title', 'description')
        }),
        ('Status & Priority', {
            'fields': ('status', 'priority', 'assigned_to')
        }),
        ('Schedule', {
            'fields': ('scheduled_date', 'started_at', 'completed_at')
        }),
        ('Costs', {
            'fields': ('labor_hours', 'labor_cost', 'parts_cost', 'total_cost')
        }),
        ('Completion', {
            'fields': ('completion_notes', 'digital_signature')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(SparePart)
class SparePartAdmin(admin.ModelAdmin):
    list_display = ['part_id', 'part_name', 'quantity_in_stock', 'minimum_stock_level', 
                    'is_low_stock', 'unit_cost', 'supplier_name']
    list_filter = ['supplier_name']
    search_fields = ['part_id', 'part_name', 'supplier_name']
    filter_horizontal = ['compatible_machines']

@admin.register(SparePartUsage)
class SparePartUsageAdmin(admin.ModelAdmin):
    list_display = ['work_order', 'spare_part', 'quantity_used', 'recorded_at']
    list_filter = ['recorded_at', 'spare_part']
    search_fields = ['work_order__work_order_id', 'spare_part__part_name']
