"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, Filter, Clock, Users, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Course {
  id: number
  title: string
  description: string
  instructor: string
  duration: string
  students: number
  rating: number
  level: "beginner" | "intermediate" | "advanced"
  category: string
  price: number
  image: string
}

export default function CoursesPage() {
  const [user, setUser] = useState<any>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(userData))

    // Mock courses data
    const mockCourses: Course[] = [
      {
        id: 1,
        title: "React Fundamentals",
        description: "Learn the basics of React development including components, props, state, and hooks.",
        instructor: "John Smith",
        duration: "8 weeks",
        students: 1245,
        rating: 4.8,
        level: "beginner",
        category: "Web Development",
        price: 99,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 2,
        title: "Advanced JavaScript",
        description: "Master advanced JavaScript concepts including closures, prototypes, and async programming.",
        instructor: "Jane Doe",
        duration: "10 weeks",
        students: 892,
        rating: 4.9,
        level: "advanced",
        category: "Programming",
        price: 149,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 3,
        title: "Node.js Backend Development",
        description: "Build scalable backend applications with Node.js, Express, and MongoDB.",
        instructor: "Mike Johnson",
        duration: "12 weeks",
        students: 567,
        rating: 4.7,
        level: "intermediate",
        category: "Backend",
        price: 179,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 4,
        title: "Python Data Science",
        description: "Analyze data and build machine learning models using Python, pandas, and scikit-learn.",
        instructor: "Sarah Wilson",
        duration: "14 weeks",
        students: 1034,
        rating: 4.6,
        level: "intermediate",
        category: "Data Science",
        price: 199,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 5,
        title: "Mobile App Development with React Native",
        description: "Create cross-platform mobile applications using React Native.",
        instructor: "David Brown",
        duration: "10 weeks",
        students: 423,
        rating: 4.5,
        level: "intermediate",
        category: "Mobile Development",
        price: 159,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 6,
        title: "DevOps Fundamentals",
        description: "Learn CI/CD, Docker, Kubernetes, and cloud deployment strategies.",
        instructor: "Lisa Chen",
        duration: "8 weeks",
        students: 678,
        rating: 4.7,
        level: "beginner",
        category: "DevOps",
        price: 129,
        image: "/placeholder.svg?height=200&width=300",
      },
    ]

    setCourses(mockCourses)
    setFilteredCourses(mockCourses)
  }, [router])

  useEffect(() => {
    let filtered = courses

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((course) => course.category === selectedCategory)
    }

    if (selectedLevel !== "all") {
      filtered = filtered.filter((course) => course.level === selectedLevel)
    }

    setFilteredCourses(filtered)
  }, [searchTerm, selectedCategory, selectedLevel, courses])

  const categories = ["all", ...Array.from(new Set(courses.map((course) => course.category)))]

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/dashboard" className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">CPS Academy</span>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/courses" className="text-blue-600 font-medium">
                Courses
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Catalog</h1>
          <p className="text-gray-600">Discover and enroll in courses to advance your skills</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                  <span className="text-lg font-bold text-blue-600">${course.price}</span>
                </div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription className="text-sm">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>By {course.instructor}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href={`/courses/${course.id}`}>
                      <Button className="w-full">{user.role === "student" ? "Enroll Now" : "View Details"}</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
