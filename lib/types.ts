export interface MaintenanceLog {
  id: string
  user_id: string
  service_date: string
  parts: string[]
  service_type: string
  description: string | null
  mileage: number | null
  cost: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface MaintenanceFormData {
  service_date: string
  parts: string[]
  service_type: string
  description: string
  mileage: string
  cost: string
  notes: string
}
