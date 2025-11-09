import { auth } from './firebase-client'

async function waitForAuthUser(timeoutMs = 3000): Promise<firebase.User | null> {
  return new Promise((resolve) => {
    console.log('[Auth] Waiting for auth user...')
    if (!auth) {
      console.error('[Auth] Firebase client not initialized!')
      return resolve(null)
    }
    const current = auth.currentUser
    if (current) {
      console.log('[Auth] User found immediately:', current.uid)
      return resolve(current)
    }
    const timeout = setTimeout(() => {
      unsubscribe()
      console.warn('[Auth] Timed out waiting for user. Final check:', auth.currentUser?.uid || 'none')
      resolve(auth.currentUser || null)
    }, timeoutMs)
    const unsubscribe = auth.onAuthStateChanged((user) => {
      clearTimeout(timeout)
      unsubscribe()
      console.log('[Auth] onAuthStateChanged fired. User:', user?.uid || 'null')
      resolve(user)
    })
  })
}

export async function getAuthToken(): Promise<string | null> {
  if (!auth) {
    console.warn('[API] Firebase auth not initialized')
    return null
  }
  const user = auth.currentUser || (await waitForAuthUser())
  if (!user) {
    console.warn('[API] No authenticated user found')
    return null
  }
  try {
    const token = await user.getIdToken(true)
    console.log('[API] Got auth token, length:', token.length)
    return token
  } catch (error) {
    console.error('[API] Error getting auth token:', error)
    return null
  }
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const attachAuth = async (): Promise<HeadersInit> => {
    const token = await getAuthToken()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      console.log(`[API] Request to ${endpoint} with auth token`)
    } else {
      console.warn(`[API] Request to ${endpoint} WITHOUT auth token`)
    }
    return headers
  }

  // First attempt
  let headers = await attachAuth()
  let response = await fetch(`/api${endpoint}`, { ...options, headers })

  // Retry once on 401 after forcing token refresh
  if (response.status === 401) {
    console.warn(`[API] Got 401 on ${endpoint}, retrying with fresh token...`)
    await auth?.currentUser?.getIdToken(true).catch(() => null)
    headers = await attachAuth()
    response = await fetch(`/api${endpoint}`, { ...options, headers })
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    console.error(`[API] Request to ${endpoint} failed:`, response.status, error)
    throw new Error(error.error || `HTTP error! status: ${response.status}`)
  }

  console.log(`[API] Request to ${endpoint} succeeded`)
  return response.json()
}

// Equipment API
export const equipmentApi = {
  getAll: async (category?: string, search?: string) => {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (search) params.append('search', search)
    const query = params.toString() ? `?${params.toString()}` : ''
    return apiRequest(`/equipment${query}`, { method: 'GET' })
  },
}

// Booking API
export const bookingApi = {
  create: async (data: {
    equipment_id: string
    start_time: string
    end_time: string
    purpose: string
    notes?: string
    priority?: 'low' | 'medium' | 'high'
  }) => {
    return apiRequest('/booking/create', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  getMy: async (status?: string) => {
    const params = status ? `?status=${status}` : ''
    return apiRequest(`/booking/my${params}`, { method: 'GET' })
  },
}

// Admin API
export const adminApi = {
  getPendingBookings: async () => {
    return apiRequest('/admin/bookings/pending', { method: 'GET' })
  },
  getAllBookings: async (status?: string) => {
    const params = status ? `?status=${status}` : ''
    return apiRequest(`/admin/bookings/all${params}`, { method: 'GET' })
  },
  updateBooking: async (booking_id: string, status: 'APPROVED' | 'REJECTED' | 'CANCELLED', admin_notes?: string) => {
    return apiRequest('/admin/bookings/update', {
      method: 'POST',
      body: JSON.stringify({ booking_id, status, admin_notes }),
    })
  },
  getLogs: async (limit = 100, offset = 0) => {
    return apiRequest(`/admin/logs?limit=${limit}&offset=${offset}`, { method: 'GET' })
  },
  // Equipment management
  createEquipment: async (data: {
    name: string
    category: string
    description?: string
    quantity: number
    image_url?: string
  }) => {
    return apiRequest('/admin/equipment/create', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  updateEquipment: async (id: string, data: {
    name?: string
    category?: string
    description?: string
    quantity?: number
    image_url?: string
    is_available?: boolean
  }) => {
    return apiRequest(`/admin/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  deleteEquipment: async (id: string) => {
    return apiRequest(`/admin/equipment/${id}`, {
      method: 'DELETE',
    })
  },
  // User management
  getUsers: async () => {
    return apiRequest('/admin/users', { method: 'GET' })
  },
}

