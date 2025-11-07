# Firestore Database Schema

This document describes the Firestore collections and data structure for the Indekun project.

## Collections

### users
Stores user information and roles.

**Fields:**
- `name` (string, required): User's full name
- `email` (string, required, unique): User's email address
- `role` (string, required): User role - "student", "faculty", or "admin"
- `firebase_uid` (string, optional): Firebase Auth UID (for linking with Firebase Auth)
- `created_at` (timestamp, auto): Creation timestamp
- `updated_at` (timestamp, auto): Last update timestamp

**Indexes:**
- Single field index on `email`
- Single field index on `role`

**Example Document:**
```json
{
  "name": "John Doe",
  "email": "john@university.edu",
  "role": "student",
  "firebase_uid": "abc123xyz",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### equipment
Stores equipment information and availability.

**Fields:**
- `name` (string, required): Equipment name
- `category` (string, required): Equipment category (e.g., "Projectors", "Computers")
- `description` (string, optional): Equipment description
- `quantity` (number, required): Available quantity
- `image_url` (string, optional): URL to equipment image
- `is_available` (boolean, required): Availability status
- `created_at` (timestamp, auto): Creation timestamp
- `updated_at` (timestamp, auto): Last update timestamp

**Indexes:**
- Single field index on `category`
- Single field index on `is_available`
- Composite index on `is_available` + `category` (for filtering)

**Example Document:**
```json
{
  "name": "Projector - Sony VPL-FHZ90",
  "category": "Projectors",
  "description": "High-quality 4K projector",
  "quantity": 3,
  "image_url": "/professional-projector.jpg",
  "is_available": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### bookings
Stores booking requests and their status.

**Fields:**
- `user_id` (string, required): Reference to user document ID
- `equipment_id` (string, required): Reference to equipment document ID
- `start_time` (timestamp, required): Booking start date/time
- `end_time` (timestamp, required): Booking end date/time
- `status` (string, required): Booking status - "PENDING", "APPROVED", "REJECTED", "CANCELLED"
- `purpose` (string, required): Purpose of booking
- `notes` (string, optional): Additional notes
- `priority` (string, required): Priority level - "low", "medium", "high"
- `created_at` (timestamp, auto): Creation timestamp
- `updated_at` (timestamp, auto): Last update timestamp

**Indexes:**
- Single field index on `user_id`
- Single field index on `equipment_id`
- Single field index on `status`
- Single field index on `start_time`
- Single field index on `end_time`
- Composite index on `equipment_id` + `status` (for conflict checking)
- Composite index on `user_id` + `status` (for user bookings)

**Example Document:**
```json
{
  "user_id": "user123",
  "equipment_id": "eq456",
  "start_time": "2024-01-15T09:00:00Z",
  "end_time": "2024-01-15T17:00:00Z",
  "status": "PENDING",
  "purpose": "Class presentation",
  "notes": "Need for lecture hall",
  "priority": "medium",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### audit_log
Stores audit logs for admin actions.

**Fields:**
- `user_id` (string, required): Reference to user document ID (admin who performed action)
- `action` (string, required): Action performed (e.g., "BOOKING_APPROVED", "BOOKING_CREATED")
- `details` (string, optional): JSON string with additional details
- `ip_address` (string, optional): IP address of the request
- `timestamp` (timestamp, auto): When the action occurred

**Indexes:**
- Single field index on `user_id`
- Single field index on `timestamp`
- Single field index on `action`
- Composite index on `timestamp` + `action` (for filtering logs)

**Example Document:**
```json
{
  "user_id": "admin123",
  "action": "BOOKING_APPROVED",
  "details": "{\"booking_id\":\"book456\",\"previous_status\":\"PENDING\"}",
  "ip_address": "192.168.1.1",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Required Firestore Indexes

Firestore will automatically create single-field indexes, but you may need to create composite indexes manually through the Firebase Console or using the Firebase CLI.

### Composite Indexes Needed:

1. **bookings collection:**
   - `equipment_id` (Ascending) + `status` (Ascending)
   - `user_id` (Ascending) + `status` (Ascending)
   - `status` (Ascending) + `created_at` (Ascending)

2. **equipment collection:**
   - `is_available` (Ascending) + `category` (Ascending)

3. **audit_log collection:**
   - `timestamp` (Descending) + `action` (Ascending)

## Security Rules

Firestore security rules should be configured to protect data. Example rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only server-side writes
    }
    
    // Equipment is readable by authenticated users
    match /equipment/{equipmentId} {
      allow read: if request.auth != null;
      allow write: if false; // Only server-side writes
    }
    
    // Bookings
    match /bookings/{bookingId} {
      allow read: if request.auth != null && 
        (resource.data.user_id == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if false; // Only server-side writes
    }
    
    // Audit logs - admin only
    match /audit_log/{logId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow write: if false; // Only server-side writes
    }
  }
}
```

## Data Seeding

Use the seed script (`scripts/seed-firestore.js`) to populate initial data.

