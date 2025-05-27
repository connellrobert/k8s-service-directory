
export type ServiceStatus = "online" | "offline" | "maintenance"

export interface Service {
  id: number
  name: string
  description: string
  url: string
  icon: string
  category: string
  status: ServiceStatus
}

export interface ServiceStats {
  totalServices: number
  onlineServices: number
  offlineServices: number
  maintenanceServices: number
}

export interface ServiceCategory {
  name: string
  count: number
} 