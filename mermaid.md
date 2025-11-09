1. ER Diagram (Complete Database Schema)

This diagram represents the complete database structure for the Campus Equipment Booking System.
It includes:
- Main Firestore Collections (8): USER, EQUIPMENT, BOOKING, AUDIT_LOG, NOTIFICATION, BOOKING_HISTORY, EQUIPMENT_MAINTENANCE, CATEGORY
- Conceptual Entities (4): Enums and lookups for roles, statuses, priorities, and action types
- External Systems (1): Firebase Authentication
Total: 13 entities showing the full data model and relationships.


erDiagram
    USER {
        string id PK "Firestore Document ID"
        string firebase_uid UK "Firebase Authentication UID"
        string email UK "User email address (unique)"
        string name "Full name of the user"
        string role "User role: student, faculty, or admin"
        timestamp created_at "Account creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    EQUIPMENT {
        string id PK "Firestore Document ID"
        string name "Equipment name/title"
        string category_id FK "Reference to category"
        string description "Detailed equipment description"
        number quantity "Available quantity of this equipment"
        string image_url "URL to equipment image"
        boolean is_available "Current availability status"
        timestamp created_at "Equipment creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    BOOKING {
        string id PK "Firestore Document ID"
        string user_id FK "Reference to user who made booking"
        string equipment_id FK "Reference to booked equipment"
        timestamp start_time "Booking start date and time"
        timestamp end_time "Booking end date and time"
        string status "Booking status: PENDING, APPROVED, REJECTED, CANCELLED"
        string purpose "Purpose/reason for booking"
        string notes "Additional user notes (optional)"
        string priority "Priority level: low, medium, high"
        string admin_notes "Admin notes/rejection reason (optional)"
        timestamp created_at "Booking request timestamp"
        timestamp updated_at "Last update timestamp"
    }

    AUDIT_LOG {
        string id PK "Firestore Document ID"
        string user_id FK "Reference to user who performed action"
        string action "Action type (e.g., BOOKING_CREATED, BOOKING_APPROVED)"
        string details "JSON string with action details"
        string ip_address "IP address of the request (optional)"
        timestamp timestamp "When the action occurred"
    }

    NOTIFICATION {
        string id PK "Firestore Document ID"
        string user_id FK "Reference to user receiving notification"
        string booking_id FK "Reference to related booking (optional)"
        string type "Notification type: booking_approved, booking_rejected, etc."
        string title "Notification title"
        string message "Notification message content"
        boolean is_read "Whether notification has been read"
        boolean is_sent "Whether notification has been sent"
        timestamp created_at "Notification creation timestamp"
        timestamp read_at "When notification was read (optional)"
        timestamp sent_at "When notification was sent (optional)"
    }

    BOOKING_HISTORY {
        string id PK "Firestore Document ID"
        string booking_id FK "Reference to booking"
        string previous_status "Previous booking status"
        string new_status "New booking status"
        string changed_by FK "Reference to user who made the change"
        string change_reason "Reason for status change"
        string notes "Additional notes about the change"
        timestamp changed_at "When the change occurred"
    }

    EQUIPMENT_MAINTENANCE {
        string id PK "Firestore Document ID"
        string equipment_id FK "Reference to equipment"
        string maintenance_type "Type: scheduled, repair, inspection, etc."
        string description "Maintenance description"
        string performed_by FK "Reference to user/admin who performed maintenance"
        timestamp scheduled_date "Scheduled maintenance date"
        timestamp completed_date "Actual completion date (optional)"
        string status "Status: scheduled, in_progress, completed, cancelled"
        string notes "Maintenance notes and details"
        number cost "Maintenance cost (optional)"
        timestamp created_at "Maintenance record creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    CATEGORY {
        string id PK "Firestore Document ID"
        string name UK "Category name (unique)"
        string description "Category description"
        string icon "Icon identifier or URL (optional)"
        number display_order "Display order for sorting"
        boolean is_active "Whether category is active"
        timestamp created_at "Category creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    %% Conceptual Entities (Enums/Lookups - stored as strings in Firestore)
    USER_ROLE {
        string value PK "Role value: student, faculty, admin"
        string description "Role description and permissions"
    }

    BOOKING_STATUS {
        string value PK "Status value: PENDING, APPROVED, REJECTED, CANCELLED"
        string description "Status description and workflow state"
    }

    PRIORITY_LEVEL {
        string value PK "Priority value: low, medium, high"
        number order "Sort order (1=high, 2=medium, 3=low)"
        string description "Priority level description"
    }

    ACTION_TYPE {
        string value PK "Action type: BOOKING_CREATED, BOOKING_APPROVED, etc."
        string description "Action description for audit logging"
    }

    %% External Systems
    FIREBASE_AUTH {
        string uid PK "Firebase Authentication UID"
        string email "User email address"
        string provider "Authentication provider"
        timestamp created_at "Account creation timestamp"
    }

    %% Relationships - Main Entities
    USER ||--o{ BOOKING : "creates"
    USER ||--o{ AUDIT_LOG : "generates"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ BOOKING_HISTORY : "makes changes"
    USER ||--o{ EQUIPMENT_MAINTENANCE : "performs maintenance"
    EQUIPMENT ||--o{ BOOKING : "receives bookings"
    EQUIPMENT ||--o{ EQUIPMENT_MAINTENANCE : "requires maintenance"
    EQUIPMENT }o--|| CATEGORY : "belongs to category"
    CATEGORY ||--o{ EQUIPMENT : "contains equipment"
    BOOKING }o--|| USER : "requested by"
    BOOKING }o--|| EQUIPMENT : "for equipment"
    BOOKING ||--o{ NOTIFICATION : "generates notifications"
    BOOKING ||--o{ BOOKING_HISTORY : "has history"
    BOOKING_HISTORY }o--|| BOOKING : "tracks changes"
    BOOKING_HISTORY }o--|| USER : "changed by"
    NOTIFICATION }o--|| USER : "sent to"
    NOTIFICATION }o--o| BOOKING : "related to"
    AUDIT_LOG }o--|| USER : "performed by"
    EQUIPMENT_MAINTENANCE }o--|| EQUIPMENT : "maintains"
    EQUIPMENT_MAINTENANCE }o--|| USER : "performed by"

    %% Relationships - Conceptual Entities (represents data validation/enum constraints)
    USER }o--|| USER_ROLE : "has role"
    BOOKING }o--|| BOOKING_STATUS : "has status"
    BOOKING }o--|| PRIORITY_LEVEL : "has priority"
    AUDIT_LOG }o--|| ACTION_TYPE : "has action type"

    %% Relationships - External Systems
    USER }o--|| FIREBASE_AUTH : "authenticated via"
    FIREBASE_AUTH ||--o| USER : "linked to user"


Use Case Diagram



graph TB
    subgraph System["Campus Equipment Booking System"]
        UC1[Login with Email/Password]
        UC2[Sign Up/Register]
        UC3[View Available Equipment]
        UC4[Browse Equipment by Category]
        UC5[Submit Booking Request]
        UC6[View My Bookings]
        UC7[View Booking History]
        UC8[View Dashboard Overview]
        
        UC9[Approve/Reject Bookings]
        UC10[View Pending Requests]
        UC11[View All Bookings]
        UC12[Manage Equipment Inventory]
        UC13[Create New Equipment]
        UC14[Update Equipment Details]
        UC15[View Equipment Details]
        UC16[View Audit Logs]
        UC17[View All Users]
        UC18[View Booking Statistics]
    end
    
    Student((Student))
    Faculty((Faculty/Staff))
    Admin((Administrator))
    Firebase[Firebase Auth]
    
    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6
    Student --> UC7
    Student --> UC8
    
    Faculty --> UC1
    Faculty --> UC2
    Faculty --> UC3
    Faculty --> UC4
    Faculty --> UC5
    Faculty --> UC6
    Faculty --> UC7
    Faculty --> UC8
    
    Admin --> UC1
    Admin --> UC3
    Admin --> UC4
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
    Admin --> UC13
    Admin --> UC14
    Admin --> UC15
    Admin --> UC16
    Admin --> UC17
    Admin --> UC18
    
    UC1 -.->|authenticates via| Firebase
    UC2 -.->|creates account via| Firebase
    UC5 -.->|includes| UC3
    UC9 -.->|updates| UC11
    
    style Student fill:#ffffff, color:#000000
    style Faculty fill:#ffffff, color:#000000
    style Admin fill:#ffffff, color:#000000
    style System fill:transparent, color:#ffffff
    style Firebase fill:#ffffff, color:#000000

    %% The following line is an attempt to make the SVG background transparent.
    %% This might not be supported by all Mermaid renderers.
    style System fill-opacity:0, stroke-width:0





Activity Diagram - Booking Flow




graph TD
    Start([Start]) --> LoginPage[User Navigates to Login Page]
    LoginPage --> AuthChoice{New User?}
    AuthChoice -->|Yes| SignUp[Navigate to Sign Up]
    AuthChoice -->|No| Login[Enter Email/Password]
    SignUp --> CreateAccount[Create Firebase Account]
    CreateAccount --> FirebaseAuth[Firebase Authentication]
    Login --> FirebaseAuth
    FirebaseAuth -->|Failed| AuthError[Display Error Message]
    AuthError --> LoginPage
    FirebaseAuth -->|Success| GetUserData[Get User Data from Firestore]
    GetUserData --> AutoProvision{User Exists<br/>in Firestore?}
    AutoProvision -->|No| CreateUserDoc[Auto-create User Document]
    AutoProvision -->|Yes| CheckRole
    CreateUserDoc --> CheckRole{Check User Role}
    CheckRole -->|Admin| AdminDashboard[Redirect to Admin Dashboard]
    CheckRole -->|Student/Faculty| UserDashboard[Redirect to User Dashboard]
    
    UserDashboard --> UserAction{User Action?}
    
    UserAction -->|Browse Equipment| Browse[View Equipment List]
    Browse --> Filter[Filter by Category]
    Filter --> EquipList[Display Available Equipment]
    EquipList --> SelectEquip{Select Equipment?}
    SelectEquip -->|No| UserDashboard
    SelectEquip -->|Yes| BookingForm[Open Booking Form]
    
    BookingForm --> EnterDetails[Enter Booking Details<br/>Start Time, End Time, Purpose, Priority]
    EnterDetails --> ValidateInput{Validate<br/>Input}
    ValidateInput -->|Invalid| InputError[Display Validation Error]
    InputError --> BookingForm
    ValidateInput -->|Valid| CheckEquipment[Check Equipment Availability]
    CheckEquipment -->|Not Available| EquipError[Display Equipment Unavailable Error]
    EquipError --> BookingForm
    CheckEquipment -->|Available| CheckConflict[Check for Time Conflicts<br/>with Existing Bookings]
    CheckConflict -->|Conflict Found| ConflictMsg[Display Conflict Error]
    ConflictMsg --> BookingForm
    
    CheckConflict -->|No Conflict| SubmitBooking[Submit Booking Request]
    SubmitBooking --> SaveFirestore[(Save to Firestore<br/>Status: PENDING)]
    SaveFirestore --> CreateAuditLog[Create Audit Log Entry]
    CreateAuditLog --> BookingPending[Booking Status: PENDING]
    BookingPending --> UserDashboard
    
    UserAction -->|View My Bookings| ViewBookings[Display User Bookings]
    ViewBookings --> UserDashboard
    
    UserAction -->|View History| ViewHistory[Display Booking History]
    ViewHistory --> UserDashboard
    
    AdminDashboard --> AdminAction{Admin Action?}
    AdminAction -->|View Pending Requests| ViewPending[Display Pending Bookings]
    ViewPending --> AdminReview{Admin Reviews<br/>Request}
    
    AdminReview -->|Approve| ApproveBooking[Update Status to APPROVED<br/>Add Admin Notes]
    ApproveBooking --> UpdateFirestore1[(Update Firestore)]
    UpdateFirestore1 --> CreateAuditLog1[Create Audit Log Entry]
    CreateAuditLog1 --> BookingApproved[Booking Confirmed]
    
    AdminReview -->|Reject| RejectBooking[Update Status to REJECTED<br/>Add Admin Notes]
    RejectBooking --> UpdateFirestore2[(Update Firestore)]
    UpdateFirestore2 --> CreateAuditLog2[Create Audit Log Entry]
    CreateAuditLog2 --> BookingRejected[Booking Rejected]
    
    AdminAction -->|Manage Equipment| ManageEquip[View Equipment List]
    ManageEquip --> EquipAction{Equipment Action?}
    EquipAction -->|Create| CreateEquip[Create New Equipment]
    EquipAction -->|Update| UpdateEquip[Update Equipment Details]
    CreateEquip --> SaveEquip[(Save to Firestore)]
    UpdateEquip --> UpdateEquipFirestore[(Update Firestore)]
    
    AdminAction -->|View Audit Logs| ViewAudit[Display Audit Logs]
    ViewAudit --> AdminDashboard
    
    AdminAction -->|View Statistics| ViewStats[Display Booking Statistics]
    ViewStats --> AdminDashboard
    
    UserAction -->|Logout| Logout[Clear Session & Logout]
    AdminAction -->|Logout| Logout
    BookingApproved --> End([End])
    BookingRejected --> End
    Logout --> End
    
    style Start fill:#fff,stroke:#000,color:#000
    style End fill:#fff,stroke:#000,color:#000
    style AuthChoice fill:#fff,stroke:#000,color:#000
    style FirebaseAuth fill:#fff,stroke:#000,color:#000
    style AutoProvision fill:#fff,stroke:#000,color:#000
    style CheckRole fill:#fff,stroke:#000,color:#000
    style UserAction fill:#fff,stroke:#000,color:#000
    style ValidateInput fill:#fff,stroke:#000,color:#000
    style CheckEquipment fill:#fff,stroke:#000,color:#000
    style CheckConflict fill:#fff,stroke:#000,color:#000
    style SelectEquip fill:#fff,stroke:#000,color:#000
    style AdminAction fill:#fff,stroke:#000,color:#000
    style AdminReview fill:#fff,stroke:#000,color:#000
    style EquipAction fill:#fff,stroke:#000,color:#000
    style SaveFirestore fill:#fff,stroke:#000,color:#000
    style UpdateFirestore1 fill:#fff,stroke:#000,color:#000
    style UpdateFirestore2 fill:#fff,stroke:#000,color:#000
    style SaveEquip fill:#fff,stroke:#000,color:#000
    style UpdateEquipFirestore fill:#fff,stroke:#000,color:#000