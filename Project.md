# Indekun - Campus Equipment Booking System
## Project Structure and Development Plan

### 1. Introduction
Indekun is a web-based platform designed to allow students, faculty, and staff to reserve campus-owned equipment. The system reduces manual management, prevents scheduling conflicts, and provides an approval workflow through an administrative panel.

---

## 2. System Modules Overview
The system consists of three major layers:

| Layer | Technologies | Responsibilities |
|------|--------------|-----------------|
| **Frontend** | React / Next.js, HTML, CSS, JavaScript | User interface and client-side interactions |
| **Backend** | Node.js (Express) or Django | Business logic and APIs |
| **Database** | MySQL / PostgreSQL | Storage of users, equipment, and booking records |

---

## 3. System Roles

| Role | Capabilities |
|------|--------------|
| **Student / Faculty** | View equipment, request bookings, view booking status |
| **Administrator** | Approve or reject requests, manage equipment inventory, view logs |

---

## 4. Frontend Application Structure

### Main Pages (Screens)
| Page | Description | Role Access |
|------|-------------|-------------|
| **Login Page** | User authentication (simple login initially, SSO later) | All users |
| **Dashboard** | Overview of bookings and quick actions | Students / Faculty / Admin |
| **Equipment List Page** | Filter and view available equipment | Students / Faculty |
| **Equipment Booking Form** | Submit booking request (date/time + reason) | Students / Faculty |
| **My Bookings Page** | Track request status | Students / Faculty |
| **Admin Panel** | System overview with pending requests | Admin |
| **Pending Requests Page** | Approve or reject booking requests | Admin |
| **Booking History Logs** | Audit and activity records | Admin |

---

## 5. Backend API Structure

### Proposed REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Authenticate user (role-based access) |
| GET | `/equipment` | Retrieve list of equipment |
| POST | `/booking/create` | Submit a new booking request |
| GET | `/booking/my` | Retrieve bookings of logged-in user |
| GET | `/admin/bookings/pending` | Retrieve pending booking requests |
| POST | `/admin/bookings/update` | Approve or reject a booking |
| GET | `/admin/logs` | Retrieve log history for audit |

---

## 6. Database Schema (ER Model Overview)

### Tables and Descriptions

| Table | Key Fields | Purpose |
|-------|------------|---------|
| **Users** | id, name, email, role | Stores system users and their roles |
| **Equipment** | id, name, category, quantity | Stores equipment information |
| **Bookings** | id, user_id, equipment_id, start_time, end_time, status | Stores booking requests and approval results |
| **Audit_Log** | id, user_id, action, timestamp | Tracks admin actions and changes |

### Booking Status Values:
`PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`

---

## 7. Core Functional Requirements

| Requirement Code | Description |
|------------------|-------------|
| REQ-1 | System shall authenticate users before access. |
| REQ-2 | System shall allow users to view available equipment. |
| REQ-3 | System shall prevent overlapping bookings. |
| REQ-4 | System shall allow users to submit booking requests. |
| REQ-5 | System shall notify admins of new requests. |
| REQ-6 | Admin shall approve/reject booking requests. |
| REQ-7 | System shall notify users of booking decisions. |
| REQ-8 | System shall log all admin actions. |

---

## 8. Non-Functional Requirements
- **Usability:** UI must be simple and accessible.
- **Security:** User authentication and HTTPS communication.
- **Performance:** System must support 100+ concurrent users.
- **Reliability:** Data consistency must be maintained across bookings.
- **Scalability:** System should allow future expansion and new features.

---

## 9. Development Workflow (What We Will Build)
1. **Design UI screens**
2. **Create database schema**
3. **Develop backend API**
4. **Connect frontend with backend**
5. **Implement role-based access**
6. **Add admin approval system**
7. **Test booking conflict logic**
8. **Finalize and deploy**

---

## 10. Final Output (Deliverables)
- Fully working web system
- Admin and user dashboards
- Database implemented and linked
- API documentation
- System demonstration

---

End of Document.
