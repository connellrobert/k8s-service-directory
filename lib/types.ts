
export type ServiceStatus = "online" | "offline" | "unknown"

export interface Service {
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


export interface IngressService {
  name: string;
  description?: string;
  host: string;
  path: string;
  url: string;
  icon?: string;
  category?: string;
}

interface IngressRule {
  host?: string;
  http: {
    paths: Array<{
      path: string;
      backend: {
        service?: {
          name: string;
        };
      };
    }>;
  };
}

interface IngressMetadata {
  annotations?: {
    'metadata.service-catalog/name'?: string;
    'metadata.service-catalog/description'?: string;
    'metadata.service-catalog/url'?: string;
    'metadata.service-catalog/icon'?: string;
    'metadata.service-catalog/omit'?: string;
    'metadata.service-catalog/category'?: string;
  };
}
