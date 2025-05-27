"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"

interface ServiceSidebarProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  serviceCounts: Record<string, number>
}

export function ServiceSidebar({ categories, selectedCategory, onCategoryChange, serviceCounts }: ServiceSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <Filter className="h-4 w-4" />
          <span className="font-semibold">Filters</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => (
                <SidebarMenuItem key={category}>
                  <SidebarMenuButton
                    onClick={() => onCategoryChange(category)}
                    isActive={selectedCategory === category}
                    className="w-full justify-between"
                  >
                    <span>{category}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {serviceCounts[category] || 0}
                    </Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
