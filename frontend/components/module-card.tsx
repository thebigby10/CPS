import type { Module } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ModuleCardProps {
  module: Module
}

export default function ModuleCard({ module }: ModuleCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">{module.name}</CardTitle>
        <CardDescription className="text-gray-600">{module.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Classes:</span>
          <Badge variant="secondary">{module.classCount}</Badge>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Topics Covered:</h4>
          <div className="flex flex-wrap gap-1">
            {module.topics.map((topic, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
