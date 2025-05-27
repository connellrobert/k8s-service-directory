# Service Directory

A service directory application that discovers and displays services from Kubernetes ingress resources and JSON configuration files.

## Deployment

The service directory is available as a Helm chart in GitHub Container Registry (GHCR). To deploy it:

1. Add the Helm repository:
```bash
helm repo add service-directory oci://ghcr.io/connellrobert/k8s-service-directory
helm repo update
```

2. Update the values file:
```bash
helm show values service-directory/k8s-service-catalog > catalog.values.yaml
```

3. Install the chart:
```bash
helm install service-directory service-directory/service-directory \
  --namespace service-directory \
  --create-namespace -f catalog.values.yaml
```

### Configuration

The following values can be configured:

```yaml
# Default values
replicaCount: 1

image:
  repository: ghcr.io/<your-username>/service-directory
  tag: latest
  pullPolicy: IfNotPresent

environment: production

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 100m
    memory: 128Mi

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  annotations:
    kubernetes.io/ingress.class: nginx
  hosts:
    - host: service-directory.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: service-directory-tls
      hosts:
        - service-directory.example.com

# Custom services to be mounted as a ConfigMap
services:
  - name: "Service Directory"
    description: "Internal service directory and catalog"
    url: "https://service-directory.example.com"
    icon: "search"
    category: "Tools"
```


## Service Configuration

The service directory can discover services from two sources:
1. Kubernetes Ingress resources
2. JSON configuration file

### JSON Configuration File

You can define additional services or override Kubernetes-discovered services using a JSON file. The file should contain an array of service objects with the following structure:

```json
[
  {
    "name": "Custom Service",
    "description": "A service defined in JSON",
    "url": "https://custom-service.example.com",
    "icon": "server"
  },
  {
    "name": "Another Service",
    "description": "This will override a Kubernetes service with the same name",
    "url": "https://another-service.example.com",
    "icon": "database"
  }
]
```

Required fields:
- `name`: The name of the service
- `url`: The service URL

Optional fields:
- `description`: A description of the service
- `icon`: An icon identifier for the service

Note: Services defined in the JSON file will take precedence over services discovered from Kubernetes with the same name.

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
- Access to a Docker compatible CLI

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