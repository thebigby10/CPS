"use client"

import { useParams, useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { mockCourses } from "@/lib/mock-data"
import ModuleCard from "@/components/module-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useEffect } from "react"

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    if (!user || user.role !== "Student") {
      router.push("/")
    }
  }, [user, router])

  if (!user || user.role !== "Student") {
    return null
  }

  const course = mockCourses.find((c) => c.id === params.id)

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">Course not found.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
        <p className="text-gray-600 text-lg">{course.description}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Course Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {course.modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </div>
    </div>
  )
}
