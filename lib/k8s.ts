import * as k8s from '@kubernetes/client-node';
import * as fs from 'fs';
import * as path from 'path';

// Kubernetes client configuration
export const kc = new k8s.KubeConfig();

// Use service account credentials if running in a pod
const serviceAccountPath = '/var/run/secrets/kubernetes.io/serviceaccount';
if (fs.existsSync(serviceAccountPath)) {
  kc.loadFromCluster();
} else {
  // Fallback to default config (for local development)
  kc.loadFromDefault();
}

// Create API client for Ingress resources
export const networkingV1Api = kc.makeApiClient(k8s.NetworkingV1Api);

export interface IngressService {
  name: string;
  description?: string;
  host: string;
  path: string;
  url: string;
  icon?: string;
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
  };
}

// Helper function to list ingress resources and extract service URLs
export async function listIngressServices(namespace: string): Promise<IngressService[]> {
  try {
    const response = await networkingV1Api.listNamespacedIngress(namespace);
    const services: IngressService[] = [];

    response.body.items.forEach((ingress: { 
      spec: { rules: IngressRule[] };
      metadata: IngressMetadata;
    }) => {
      const annotations = ingress.metadata?.annotations || {};
      const displayName = annotations['metadata.service-catalog/name'];
      const description = annotations['metadata.service-catalog/description'];
      const customUrl = annotations['metadata.service-catalog/url'];
      const icon = annotations['metadata.service-catalog/icon'];

      ingress.spec.rules.forEach((rule: IngressRule) => {
        const host = rule.host || 'localhost';
        rule.http.paths.forEach((path: IngressRule['http']['paths'][0]) => {
          if (path.backend.service) {
            services.push({
              name: displayName || path.backend.service.name,
              description,
              host: customUrl ? "" : host,
              path: customUrl ? "" :path.path,
              url: customUrl || `https://${host}${path.path}`,
              icon: icon || ""
            });
          }
        });
      });
    });

    return services;
  } catch (error) {
    console.error(`Error listing ingress services in namespace ${namespace}:`, error);
    return [];
  }
} 