import type React from "react"
import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ServiceStatus } from "@/lib/types"

interface ServiceCardProps {
  name: string
  description?: string
  url: string
  icon: React.ReactNode | string
  category: string
  status: ServiceStatus
}

export function ServiceCard({ name, description, url, icon, category, status }: ServiceCardProps) {
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-red-500",
    unknown: "bg-yellow-500",
  }

  const renderIcon = () => {
    if (typeof icon === 'string') {
      return (
        <Image
          src={icon}
          alt={`${name} icon`}
          width={20}
          height={20}
          className="object-contain"
        />
      )
    }
    return icon
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {renderIcon()}
            </div>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {category}
                </Badge>
                <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
                <span className="text-xs text-muted-foreground capitalize">{status}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="mb-4 line-clamp-2">{description}</CardDescription>
        <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground" variant="outline">
          <a href={url} target="_blank" rel="noopener noreferrer">
            Access Service
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
