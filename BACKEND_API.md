# Backend API Documentation

This document describes all the API endpoints available in the Indekun backend.

## Base URL

All API endpoints are prefixed with `/api`

## Authentication

Most endpoints require authentication using a JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication

#### POST `/api/auth/login`
Authenticate a user using Firebase ID token.

**Note:** The client should first sign in using Firebase Auth SDK, then send the ID token to this endpoint.

**Request Body:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij..."
}
```

**Response:**
```json
{
  "user": {
    "id": "abc123",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "student",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Client-side example:**
```javascript
import { signInWithEmailAndPassword } from 'firebase/auth';

// Sign in with Firebase Auth
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const idToken = await userCredential.user.getIdToken();

// Send ID token to your API
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ idToken })
});
```

#### POST `/api/auth/signup`
Register a new user in Firebase Auth and Firestore.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "student"  // optional: "student" | "faculty" | "admin"
}
```

**Response:**
```json
{
  "token": "custom_token_...",
  "user": {
    "id": "abc123",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "student",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Note:** The returned token is a custom token. The client should exchange it for an ID token:
```javascript
import { signInWithCustomToken } from 'firebase/auth';

const userCredential = await signInWithCustomToken(auth, customToken);
const idToken = await userCredential.user.getIdToken();
```

### Equipment

#### GET `/api/equipment`
Get list of available equipment. Requires authentication.

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search in name and description

**Response:**
```json
{
  "equipment": [
    {
      "id": 1,
      "name": "Projector - Sony VPL-FHZ90",
      "category": "Projectors",
      "description": "High-quality 4K projector",
      "quantity": 3,
      "image_url": "/professional-projector.jpg",
      "is_available": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Bookings

#### POST `/api/booking/create`
Create a new booking request. Requires authentication.

**Request Body:**
```json
{
  "equipment_id": 1,
  "start_time": "2024-01-15T09:00:00.000Z",
  "end_time": "2024-01-15T17:00:00.000Z",
  "purpose": "Class presentation",
  "notes": "Additional notes",  // optional
  "priority": "medium"  // optional: "low" | "medium" | "high"
}
```

**Response:**
```json
{
  "booking": {
    "id": 1,
    "user_id": 1,
    "equipment_id": 1,
    "start_time": "2024-01-15T09:00:00.000Z",
    "end_time": "2024-01-15T17:00:00.000Z",
    "status": "PENDING",
    "purpose": "Class presentation",
    "notes": "Additional notes",
    "priority": "medium",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET `/api/booking/my`
Get bookings for the authenticated user.

**Query Parameters:**
- `status` (optional): Filter by status ("PENDING" | "APPROVED" | "REJECTED" | "CANCELLED")

**Response:**
```json
{
  "bookings": [
    {
      "id": 1,
      "user_id": 1,
      "equipment_id": 1,
      "start_time": "2024-01-15T09:00:00.000Z",
      "end_time": "2024-01-15T17:00:00.000Z",
      "status": "PENDING",
      "purpose": "Class presentation",
      "notes": "Additional notes",
      "priority": "medium",
      "equipment_name": "Projector - Sony VPL-FHZ90",
      "category": "Projectors",
      "image_url": "/professional-projector.jpg",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Admin Endpoints

All admin endpoints require admin role authentication.

#### GET `/api/admin/bookings/pending`
Get all pending booking requests.

**Response:**
```json
{
  "bookings": [
    {
      "id": 1,
      "user_id": 1,
      "equipment_id": 1,
      "start_time": "2024-01-15T09:00:00.000Z",
      "end_time": "2024-01-15T17:00:00.000Z",
      "status": "PENDING",
      "purpose": "Class presentation",
      "notes": "Additional notes",
      "priority": "high",
      "user_name": "John Doe",
      "user_email": "john@example.com",
      "user_role": "student",
      "equipment_name": "Projector - Sony VPL-FHZ90",
      "category": "Projectors",
      "image_url": "/professional-projector.jpg",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/api/admin/bookings/update`
Approve or reject a booking request.

**Request Body:**
```json
{
  "booking_id": 1,
  "status": "APPROVED",  // "APPROVED" | "REJECTED" | "CANCELLED"
  "admin_notes": "Approved for use"  // optional
}
```

**Response:**
```json
{
  "booking": {
    "id": 1,
    "user_id": 1,
    "equipment_id": 1,
    "start_time": "2024-01-15T09:00:00.000Z",
    "end_time": "2024-01-15T17:00:00.000Z",
    "status": "APPROVED",
    "purpose": "Class presentation",
    "notes": "Approved for use",
    "priority": "high",
    "user_name": "John Doe",
    "user_email": "john@example.com",
    "user_role": "student",
    "equipment_name": "Projector - Sony VPL-FHZ90",
    "category": "Projectors",
    "image_url": "/professional-projector.jpg",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET `/api/admin/logs`
Get audit logs for admin actions.

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 100)
- `offset` (optional): Number of records to skip (default: 0)

**Response:**
```json
{
  "logs": [
    {
      "id": 1,
      "user_id": 1,
      "action": "BOOKING_APPROVED",
      "details": "{\"booking_id\":1,\"previous_status\":\"PENDING\",\"admin_notes\":\"Approved\"}",
      "ip_address": "127.0.0.1",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "user_name": "Admin User",
      "user_email": "admin@university.edu"
    }
  ],
  "total": 100
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Error message describing what went wrong"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden: Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Booking Status Values

- `PENDING`: Booking request is awaiting admin approval
- `APPROVED`: Booking has been approved by admin
- `REJECTED`: Booking has been rejected by admin
- `CANCELLED`: Booking has been cancelled

## Priority Levels

- `low`: Low priority booking
- `medium`: Medium priority booking (default)
- `high`: High priority booking

## User Roles

- `student`: Student user
- `faculty`: Faculty user
- `admin`: Administrator user

