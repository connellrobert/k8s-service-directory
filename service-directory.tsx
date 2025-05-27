"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Server,
  Database,
  Shield,
  BarChart3,
  GitBranch,
  FileText,
  Users,
  Settings,
  Zap,
  Monitor,
  Cloud,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ServiceCard } from "./components/service-card"
import { ServiceStats } from "./components/service-stats"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { ServiceSidebar } from "./components/service-sidebar"

const services = [
  {
    id: 1,
    name: "Grafana",
    description: "Monitoring and observability platform for metrics, logs, and traces",
    url: "https://grafana.internal.company.com",
    icon: <BarChart3 className="h-5 w-5" />,
    category: "Monitoring",
    status: "online" as const,
  },
  {
    id: 2,
    name: "Jenkins",
    description: "Continuous integration and deployment automation server",
    url: "https://jenkins.internal.company.com",
    icon: <GitBranch className="h-5 w-5" />,
    category: "CI/CD",
    status: "online" as const,
  },
  {
    id: 3,
    name: "Confluence",
    description: "Team collaboration and documentation platform",
    url: "https://confluence.internal.company.com",
    icon: <FileText className="h-5 w-5" />,
    category: "Documentation",
    status: "maintenance" as const,
  },
  {
    id: 4,
    name: "LDAP Directory",
    description: "Centralized user authentication and directory services",
    url: "https://ldap.internal.company.com",
    icon: <Users className="h-5 w-5" />,
    category: "Authentication",
    status: "online" as const,
  },
  {
    id: 5,
    name: "PostgreSQL Admin",
    description: "Database administration and management interface",
    url: "https://pgadmin.internal.company.com",
    icon: <Database className="h-5 w-5" />,
    category: "Database",
    status: "online" as const,
  },
  {
    id: 6,
    name: "Vault",
    description: "Secrets management and encryption service",
    url: "https://vault.internal.company.com",
    icon: <Shield className="h-5 w-5" />,
    category: "Security",
    status: "online" as const,
  },
  {
    id: 7,
    name: "Prometheus",
    description: "Time series database and monitoring system",
    url: "https://prometheus.internal.company.com",
    icon: <Monitor className="h-5 w-5" />,
    category: "Monitoring",
    status: "online" as const,
  },
  {
    id: 8,
    name: "Kubernetes Dashboard",
    description: "Web-based user interface for Kubernetes clusters",
    url: "https://k8s-dashboard.internal.company.com",
    icon: <Cloud className="h-5 w-5" />,
    category: "Infrastructure",
    status: "offline" as const,
  },
  {
    id: 9,
    name: "Elasticsearch",
    description: "Search and analytics engine for log data",
    url: "https://elasticsearch.internal.company.com",
    icon: <Search className="h-5 w-5" />,
    category: "Search",
    status: "online" as const,
  },
  {
    id: 10,
    name: "Redis Admin",
    description: "In-memory data structure store management",
    url: "https://redis.internal.company.com",
    icon: <Zap className="h-5 w-5" />,
    category: "Cache",
    status: "online" as const,
  },
  {
    id: 11,
    name: "Nexus Repository",
    description: "Artifact repository manager for build artifacts",
    url: "https://nexus.internal.company.com",
    icon: <Server className="h-5 w-5" />,
    category: "Repository",
    status: "online" as const,
  },
  {
    id: 12,
    name: "System Config",
    description: "Centralized system configuration management",
    url: "https://config.internal.company.com",
    icon: <Settings className="h-5 w-5" />,
    category: "Configuration",
    status: "maintenance" as const,
  },
]

const categories = [
  "All",
  "Monitoring",
  "CI/CD",
  "Documentation",
  "Authentication",
  "Database",
  "Security",
  "Infrastructure",
  "Search",
  "Cache",
  "Repository",
  "Configuration",
]

export default function ServiceDirectory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || service.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const stats = useMemo(() => {
    const total = services.length
    const online = services.filter((s) => s.status === "online").length
    const offline = services.filter((s) => s.status === "offline").length
    const maintenance = services.filter((s) => s.status === "maintenance").length
    return { total, online, offline, maintenance }
  }, [])

  const serviceCounts = useMemo(() => {
    const counts: Record<string, number> = { All: services.length }
    categories.slice(1).forEach((category) => {
      counts[category] = services.filter((service) => service.category === category).length
    })
    return counts
  }, [])

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <ServiceSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          serviceCounts={serviceCounts}
        />
        <SidebarInset className="flex-1">
          <div className="min-h-screen bg-background">
            <div className="border-b">
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight">Service Directory</h1>
                      <p className="text-muted-foreground">Access internal network services and tools</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Network Status: Operational</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 py-8">
              <div className="space-y-8">
                <ServiceStats
                  totalServices={stats.total}
                  onlineServices={stats.online}
                  offlineServices={stats.offline}
                  maintenanceServices={stats.maintenance}
                />

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Category: {selectedCategory}</span>
                    {selectedCategory !== "All" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCategory("All")}
                        className="h-6 px-2 text-xs"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>

                {filteredServices.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No services found</h3>
                    <p className="text-muted-foreground">Try adjusting your search terms or category filter</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredServices.map((service) => (
                      <ServiceCard
                        key={service.id}
                        name={service.name}
                        description={service.description}
                        url={service.url}
                        icon={service.icon}
                        category={service.category}
                        status={service.status}
                      />
                    ))}
                  </div>
                )}

                <div className="text-center text-sm text-muted-foreground">
                  <p>
                    Showing {filteredServices.length} of {services.length} services
                    {selectedCategory !== "All" && ` in ${selectedCategory}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
