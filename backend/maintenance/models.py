from django.db import models
from django.utils import timezone
from machines.models import Machine
from authentication.models import CustomUser

class WorkOrder(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    ]
    
    work_order_id = models.CharField(max_length=50, unique=True, db_index=True)
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, related_name='work_orders')
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING', db_index=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='MEDIUM')
    
    assigned_to = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, 
                                     related_name='assigned_work_orders')
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, 
                                    related_name='created_work_orders')
    
    scheduled_date = models.DateField(db_index=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    labor_hours = models.FloatField(default=0)
    labor_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    parts_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    completion_notes = models.TextField(blank=True)
    digital_signature = models.ImageField(upload_to='signatures/', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'work_orders'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['work_order_id']),
            models.Index(fields=['status']),
            models.Index(fields=['scheduled_date']),
        ]
    
    def __str__(self):
        return f"{self.work_order_id} - {self.machine.machine_id}"
    
    @property
    def total_cost(self):
        return self.labor_cost + self.parts_cost

class SparePart(models.Model):
    part_id = models.CharField(max_length=50, unique=True, db_index=True)
    part_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    compatible_machines = models.ManyToManyField(Machine, related_name='spare_parts', blank=True)
    
    quantity_in_stock = models.IntegerField(default=0)
    minimum_stock_level = models.IntegerField(default=5)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    
    supplier_name = models.CharField(max_length=100, blank=True)
    supplier_contact = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'spare_parts'
        ordering = ['part_name']
    
    def __str__(self):
        return f"{self.part_id} - {self.part_name}"
    
    @property
    def is_low_stock(self):
        return self.quantity_in_stock <= self.minimum_stock_level

class SparePartUsage(models.Model):
    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name='parts_used')
    spare_part = models.ForeignKey(SparePart, on_delete=models.CASCADE)
    
    quantity_used = models.IntegerField()
    notes = models.TextField(blank=True)
    
    recorded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'spare_part_usage'
        ordering = ['-recorded_at']
    
    def __str__(self):
        return f"{self.spare_part.part_name} x {self.quantity_used} - {self.work_order.work_order_id}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.spare_part.quantity_in_stock -= self.quantity_used
        self.spare_part.save(update_fields=['quantity_in_stock'])
