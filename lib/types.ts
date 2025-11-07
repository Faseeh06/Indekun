export type UserRole = 'student' | 'faculty' | 'admin'
export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
export type Priority = 'low' | 'medium' | 'high'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Equipment {
  id: number
  name: string
  category: string
  description: string | null
  quantity: number
  image_url: string | null
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: number
  user_id: number
  equipment_id: number
  start_time: string
  end_time: string
  status: BookingStatus
  purpose: string
  notes: string | null
  priority: Priority
  created_at: string
  updated_at: string
  // Joined fields
  user?: User
  equipment?: Equipment
  user_name?: string
  user_email?: string
  user_role?: UserRole
  equipment_name?: string
  category?: string
  image_url?: string
}

export interface AuditLog {
  id: number
  user_id: number
  action: string
  details: string | null
  ip_address: string | null
  timestamp: string
  user?: User
  user_name?: string
  user_email?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface CreateBookingRequest {
  equipment_id: number
  start_time: string
  end_time: string
  purpose: string
  notes?: string
  priority?: Priority
}

export interface UpdateBookingRequest {
  booking_id: number
  status: BookingStatus
  admin_notes?: string
}

