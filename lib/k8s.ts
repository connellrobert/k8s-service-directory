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
  host: string;
  path: string;
  url: string;
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

// Helper function to list ingress resources and extract service URLs
export async function listIngressServices(namespace: string): Promise<IngressService[]> {
  try {
    const response = await networkingV1Api.listNamespacedIngress(namespace);
    const services: IngressService[] = [];

    response.body.items.forEach((ingress: { spec: { rules: IngressRule[] } }) => {
      ingress.spec.rules.forEach((rule: IngressRule) => {
        const host = rule.host || 'localhost';
        rule.http.paths.forEach((path: IngressRule['http']['paths'][0]) => {
          if (path.backend.service) {
            services.push({
              name: path.backend.service.name,
              host,
              path: path.path,
              url: `https://${host}${path.path}`
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