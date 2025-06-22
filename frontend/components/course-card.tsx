"use client"

import type { Course } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CourseCardProps {
  course: Course
  onClick?: () => void
  interactive?: boolean
}

export default function CourseCard({ course, onClick, interactive = false }: CourseCardProps) {
  const cardClass = interactive ? "cursor-pointer hover:shadow-lg transition-shadow duration-200" : ""

  return (
    <Card className={cardClass} onClick={onClick}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">{course.title}</CardTitle>
        <CardDescription className="text-gray-600">{course.description}</CardDescription>
      </CardHeader>
      {interactive && (
        <CardContent>
          <p className="text-sm text-blue-600 font-medium">{course.modules.length} modules available</p>
        </CardContent>
      )}
    </Card>
  )
}
