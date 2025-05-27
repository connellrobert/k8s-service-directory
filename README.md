# Service Directory

A service directory application that discovers and displays services from Kubernetes ingress resources.

## Service Account Setup

The application requires a service account with permissions to list ingress resources. Here's how to set it up:

```yaml
# service-account.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: service-directory
  namespace: default
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: service-directory
rules:
- apiGroups: ["networking.k8s.io"]
  resources: ["ingresses"]
  verbs: ["list", "get"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: service-directory
subjects:
- kind: ServiceAccount
  name: service-directory
  namespace: default
roleRef:
  kind: ClusterRole
  name: service-directory
  apiGroup: rbac.authorization.k8s.io
```

Apply the configuration:
```bash
kubectl apply -f service-account.yaml
```

## Ingress Annotations

The service directory uses annotations on ingress resources to enhance service information. The following annotations are supported:

### `metadata.service-catalog/name`
Override the service name displayed in the directory.
```yaml
metadata:
  annotations:
    metadata.service-catalog/name: "My Awesome Service"
```

### `metadata.service-catalog/description`
Add a description for the service.
```yaml
metadata:
  annotations:
    metadata.service-catalog/description: "A service that does amazing things"
```

### `metadata.service-catalog/url`
Override the default URL construction. If not provided, the URL will be constructed from the ingress host and path.
```yaml
metadata:
  annotations:
    metadata.service-catalog/url: "https://custom-domain.com/service"
```

### `metadata.service-catalog/icon`
Specify an icon for the service. The icon should be a valid icon identifier supported by the UI.
```yaml
metadata:
  annotations:
    metadata.service-catalog/icon: "server"
```

### `metadata.service-catalog/omit`
Exclude the service from the service directory. Set to "true" to omit the service.
```yaml
metadata:
  annotations:
    metadata.service-catalog/omit: "true"
```

### Example Ingress Resource

Here's a complete example of an ingress resource with all supported annotations:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-service
  annotations:
    metadata.service-catalog/name: "My Awesome Service"
    metadata.service-catalog/description: "A service that does amazing things"
    metadata.service-catalog/url: "https://custom-domain.com/service"
    metadata.service-catalog/icon: "server"
    # Set to "true" to exclude this service from the directory
    # metadata.service-catalog/omit: "true"
spec:
  rules:
    - host: example.com
      http:
        paths:
          - path: /api
            backend:
              service:
                name: my-service
```

## Development

### Prerequisites
- Node.js
- pnpm
- Access to a Kubernetes cluster

### Installation
```bash
pnpm install
```

### Running Locally
```bash
pnpm dev
```

### Building
```bash
pnpm build
``` 