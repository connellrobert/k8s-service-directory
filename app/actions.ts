"use server"

import { Service } from "@/lib/types"
import fs from "fs"
import { getAllServices } from "@/lib/k8s"

export async function getK8sServices(): Promise<Service[]> {
  // Get namespace from mounted service account directory
  const tokenDirectory = process.env.KUBERNETES_SERVICE_ACCOUNT_TOKEN_PATH || '/var/run/secrets/kubernetes.io/serviceaccount'
  const namespace = fs.readFileSync(`${tokenDirectory}/namespace`, 'utf8')
  const extraServicesFilePath = process.env.EXTRA_SERVICES_FILE_PATH || '/config/services.json'
  return getAllServices(namespace, extraServicesFilePath).then(services => services.map(service => ({
    ...service,
    status: "unknown",
    description: service.description || "",
    url: service.url || "",
    icon: service.icon || "",
    category: service.category || "",
  })))
}