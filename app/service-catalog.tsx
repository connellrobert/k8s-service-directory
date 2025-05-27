'use client'

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { ServiceSidebar } from "@/components/service-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Service } from "@/lib/types"
import { useMemo } from "react"

import { useState } from "react"

import { useEffect } from "react"
import { ServiceStats } from "@/components/service-stats"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ServiceCard } from "@/components/service-card"
import { getK8sServices } from "@/app/actions"

export const ServiceCatalog = () => {

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    getK8sServices().then(setServices)
  }, [getK8sServices])


  const categories = useMemo(() => {
    const uniqueCategories = new Set(services.map(service => service.category))
    return ["All", ...Array.from(uniqueCategories)]
  }, [services])

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || service.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory, services])

  const stats = useMemo(() => {
    const total = services.length
    const online = services.filter((s) => s.status === "online").length
    const offline = services.filter((s) => s.status === "offline").length
    const unknown = services.filter((s) => s.status === "unknown").length
    return { total, online, offline, unknown }
  }, [services])

  const serviceCounts = useMemo(() => {
    const counts: Record<string, number> = { All: services.length }
    categories.slice(1).forEach((category) => {
      counts[category] = services.filter((service) => service.category === category).length
    })
    return counts
  }, [categories, services])

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
                  unknownServices={stats.unknown}
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
                        key={service.name}
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