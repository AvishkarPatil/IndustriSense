# Database Schema

## Tables Overview

### 1. users (CustomUser)
```sql
- id: INTEGER (PK)
- username: VARCHAR(150) UNIQUE
- email: VARCHAR(254)
- password: VARCHAR(128) (hashed)
- role: VARCHAR(20) [ADMIN, SUPERVISOR, TECHNICIAN]
- phone_number: VARCHAR(15)
- factory_location: VARCHAR(100)
- profile_photo: VARCHAR(100)
- first_name: VARCHAR(150)
- last_name: VARCHAR(150)
- is_active: BOOLEAN
- is_staff: BOOLEAN
- date_joined: TIMESTAMP
```

### 2. machines
```sql
- id: INTEGER (PK)
- machine_id: VARCHAR(50) UNIQUE (indexed)
- machine_name: VARCHAR(100)
- machine_type: VARCHAR(100)
- manufacturer: VARCHAR(100)
- model_number: VARCHAR(100)
- location: VARCHAR(100)
- installation_date: DATE
- warranty_expiry: DATE
- status: VARCHAR(20) [OPERATIONAL, UNDER_MAINTENANCE, DOWN, DECOMMISSIONED]
- maintenance_frequency_days: INTEGER
- last_maintenance_date: DATE
- next_maintenance_date: DATE (indexed)
- specifications: JSONB
- manual_document: VARCHAR(100)
- machine_photo: VARCHAR(100)
- qr_code: VARCHAR(100)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- created_by_id: INTEGER (FK -> users.id)
```

### 3. machine_readings
```sql
- id: INTEGER (PK)
- machine_id: INTEGER (FK -> machines.id, indexed)
- logged_by_id: INTEGER (FK -> users.id)
- timestamp: TIMESTAMP (indexed)
- temperature: FLOAT
- vibration_level: FLOAT
- oil_pressure: FLOAT
- runtime_hours: INTEGER
- custom_readings: JSONB
- inspection_photo: VARCHAR(100)
- notes: TEXT
- is_anomaly: BOOLEAN (indexed)
- anomaly_reason: TEXT
```

### 4. work_orders
```sql
- id: INTEGER (PK)
- work_order_id: VARCHAR(50) UNIQUE (indexed)
- machine_id: INTEGER (FK -> machines.id)
- title: VARCHAR(200)
- description: TEXT
- status: VARCHAR(20) [PENDING, IN_PROGRESS, COMPLETED, CANCELLED] (indexed)
- priority: VARCHAR(20) [LOW, MEDIUM, HIGH, CRITICAL]
- assigned_to_id: INTEGER (FK -> users.id)
- created_by_id: INTEGER (FK -> users.id)
- scheduled_date: DATE (indexed)
- started_at: TIMESTAMP
- completed_at: TIMESTAMP
- labor_hours: FLOAT
- labor_cost: DECIMAL(10,2)
- parts_cost: DECIMAL(10,2)
- completion_notes: TEXT
- digital_signature: VARCHAR(100)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 5. spare_parts
```sql
- id: INTEGER (PK)
- part_id: VARCHAR(50) UNIQUE (indexed)
- part_name: VARCHAR(200)
- description: TEXT
- quantity_in_stock: INTEGER
- minimum_stock_level: INTEGER
- unit_cost: DECIMAL(10,2)
- supplier_name: VARCHAR(100)
- supplier_contact: VARCHAR(100)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 6. spare_parts_compatible_machines (M2M)
```sql
- id: INTEGER (PK)
- sparepart_id: INTEGER (FK -> spare_parts.id)
- machine_id: INTEGER (FK -> machines.id)
```

### 7. spare_part_usage
```sql
- id: INTEGER (PK)
- work_order_id: INTEGER (FK -> work_orders.id)
- spare_part_id: INTEGER (FK -> spare_parts.id)
- quantity_used: INTEGER
- notes: TEXT
- recorded_at: TIMESTAMP
```

## Relationships

```
users (1) ----< (N) machines [created_by]
users (1) ----< (N) machine_readings [logged_by]
users (1) ----< (N) work_orders [assigned_to]
users (1) ----< (N) work_orders [created_by]

machines (1) ----< (N) machine_readings
machines (1) ----< (N) work_orders
machines (N) ----< (N) spare_parts [compatible_machines]

work_orders (1) ----< (N) spare_part_usage
spare_parts (1) ----< (N) spare_part_usage
```

## Indexes

**machines:**
- machine_id (unique)
- next_maintenance_date
- status

**machine_readings:**
- timestamp (desc)
- machine_id + timestamp
- is_anomaly

**work_orders:**
- work_order_id (unique)
- status
- scheduled_date

**spare_parts:**
- part_id (unique)

## Sample Data

**Users:** 3 (admin, supervisor, tech)
**Machines:** 5 (CNC-001, CNC-002, INJ-001, INJ-002, CONV-001)
**Readings:** 15+
**Work Orders:** 3
**Spare Parts:** 5
**Part Usage:** Linked to work orders

## Key Features

- **JSONB fields** for flexible specifications and custom readings
- **Automatic timestamps** (created_at, updated_at)
- **Soft deletes** via status fields
- **Proper indexing** for performance
- **Foreign key constraints** for data integrity
- **Cascading deletes** where appropriate
