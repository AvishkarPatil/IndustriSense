import os
import django
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'factory_maintenance.settings')
django.setup()

from authentication.models import CustomUser
from machines.models import Machine, MachineReading
from maintenance.models import WorkOrder, SparePart

print("Loading sample data...")

# Create users
admin, _ = CustomUser.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'admin@mail.com',
        'first_name': 'Avishkar',
        'last_name': 'Patil',
        'role': 'ADMIN',
        'is_staff': True,
        'is_superuser': True
    }
)
admin.set_password('HueHueHue#69')
admin.save()

supervisor, _ = CustomUser.objects.get_or_create(
    username='supervisor',
    defaults={
        'email': 'supervisor@mail.com',
        'first_name': 'Super',
        'last_name': 'Visor',
        'role': 'SUPERVISOR'
    }
)
supervisor.set_password('pass')
supervisor.save()

tech, _ = CustomUser.objects.get_or_create(
    username='tech',
    defaults={
        'email': 'tech@mail.com',
        'first_name': 'Tech',
        'last_name': 'Nician',
        'role': 'TECHNICIAN'
    }
)
tech.set_password('pass')
tech.save()

print("✓ Users created")

# Create machines
machines_data = [
    {
        'machine_id': 'CNC-001',
        'machine_name': 'CNC Lathe Machine',
        'machine_type': 'CNC',
        'location': 'Shop Floor A',
        'installation_date': '2020-01-15',
        'status': 'OPERATIONAL',
        'maintenance_frequency_days': 30,
        'last_maintenance_date': datetime.now().date() - timedelta(days=5)
    },
    {
        'machine_id': 'CNC-002',
        'machine_name': 'CNC Milling Machine',
        'machine_type': 'CNC',
        'location': 'Shop Floor A',
        'installation_date': '2020-03-20',
        'status': 'OPERATIONAL',
        'maintenance_frequency_days': 30,
        'last_maintenance_date': datetime.now().date() - timedelta(days=10)
    },
    {
        'machine_id': 'INJ-001',
        'machine_name': 'Injection Molding Machine 1',
        'machine_type': 'Injection Molding',
        'location': 'Shop Floor B',
        'installation_date': '2019-06-10',
        'status': 'OPERATIONAL',
        'maintenance_frequency_days': 45,
        'last_maintenance_date': datetime.now().date() - timedelta(days=40)
    },
    {
        'machine_id': 'INJ-002',
        'machine_name': 'Injection Molding Machine 2',
        'machine_type': 'Injection Molding',
        'location': 'Shop Floor B',
        'installation_date': '2019-08-15',
        'status': 'UNDER_MAINTENANCE',
        'maintenance_frequency_days': 45,
        'last_maintenance_date': datetime.now().date() - timedelta(days=2)
    },
    {
        'machine_id': 'CONV-001',
        'machine_name': 'Conveyor Belt System',
        'machine_type': 'Conveyor',
        'location': 'Assembly Line',
        'installation_date': '2018-11-01',
        'status': 'OPERATIONAL',
        'maintenance_frequency_days': 60,
        'last_maintenance_date': datetime.now().date() - timedelta(days=55)
    }
]

for data in machines_data:
    machine, created = Machine.objects.get_or_create(
        machine_id=data['machine_id'],
        defaults={**data, 'created_by': admin}
    )
    if created:
        machine.calculate_next_maintenance()
        
        # Add readings
        for i in range(15):
            MachineReading.objects.create(
                machine=machine,
                logged_by=tech,
                temperature=70 + (i % 10),
                vibration_level=1.0 + (i % 5) * 0.5,
                oil_pressure=40 + (i % 8)
            )

print("✓ Machines and readings created")

# Create spare parts
parts_data = [
    {
        'part_id': 'BRG-001',
        'part_name': 'Bearing Set',
        'quantity_in_stock': 15,
        'minimum_stock_level': 10,
        'unit_cost': 250.00
    },
    {
        'part_id': 'OIL-001',
        'part_name': 'Hydraulic Oil',
        'quantity_in_stock': 3,
        'minimum_stock_level': 5,
        'unit_cost': 150.00
    },
    {
        'part_id': 'BELT-001',
        'part_name': 'Drive Belt',
        'quantity_in_stock': 2,
        'minimum_stock_level': 5,
        'unit_cost': 80.00
    },
    {
        'part_id': 'SEAL-001',
        'part_name': 'Seal Kit',
        'quantity_in_stock': 20,
        'minimum_stock_level': 8,
        'unit_cost': 45.00
    },
    {
        'part_id': 'FILTER-001',
        'part_name': 'Air Filter',
        'quantity_in_stock': 12,
        'minimum_stock_level': 6,
        'unit_cost': 35.00
    }
]

for data in parts_data:
    SparePart.objects.get_or_create(part_id=data['part_id'], defaults=data)

print("✓ Spare parts created")

# Create work orders
wo_data = [
    {
        'work_order_id': 'WO-001',
        'machine': Machine.objects.get(machine_id='CNC-001'),
        'title': 'Routine Maintenance',
        'description': 'Regular maintenance check',
        'status': 'COMPLETED',
        'priority': 'MEDIUM',
        'assigned_to': tech,
        'scheduled_date': datetime.now().date() - timedelta(days=5),
        'labor_cost': 500,
        'parts_cost': 200
    },
    {
        'work_order_id': 'WO-002',
        'machine': Machine.objects.get(machine_id='INJ-002'),
        'title': 'Emergency Repair',
        'description': 'Hydraulic system failure',
        'status': 'IN_PROGRESS',
        'priority': 'CRITICAL',
        'assigned_to': tech,
        'scheduled_date': datetime.now().date(),
        'labor_cost': 0,
        'parts_cost': 0
    },
    {
        'work_order_id': 'WO-003',
        'machine': Machine.objects.get(machine_id='CONV-001'),
        'title': 'Belt Replacement',
        'description': 'Replace worn drive belt',
        'status': 'PENDING',
        'priority': 'HIGH',
        'assigned_to': tech,
        'scheduled_date': datetime.now().date() + timedelta(days=2),
        'labor_cost': 0,
        'parts_cost': 0
    }
]

for data in wo_data:
    WorkOrder.objects.get_or_create(
        work_order_id=data['work_order_id'],
        defaults={**data, 'created_by': supervisor}
    )

print("✓ Work orders created")
print("\n✅ Sample data loaded successfully!")
print("\nLogin credentials:")
print("  Admin: admin / HueHueHue#69")
print("  Supervisor: supervisor / pass")
print("  Technician: tech / pass")
