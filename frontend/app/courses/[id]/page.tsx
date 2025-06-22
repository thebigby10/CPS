"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Clock, Users, Star, Play, CheckCircle, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

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
  fullDescription: string
  whatYouWillLearn: string[]
  requirements: string[]
  modules: Module[]
}

interface Module {
  id: number
  title: string
  lessons: Lesson[]
  duration: string
}

interface Lesson {
  id: number
  title: string
  duration: string
  type: "video" | "reading" | "quiz"
  completed?: boolean
  locked?: boolean
}

export default function CourseDetailPage() {
  const [user, setUser] = useState<any>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(userData))

    // Mock course data
    const mockCourse: Course = {
      id: Number.parseInt(params.id as string),
      title: "React Fundamentals",
      description: "Learn the basics of React development including components, props, state, and hooks.",
      instructor: "John Smith",
      duration: "8 weeks",
      students: 1245,
      rating: 4.8,
      level: "beginner",
      category: "Web Development",
      price: 99,
      fullDescription: `This comprehensive React course will take you from beginner to confident React developer. You'll learn all the fundamental concepts including components, JSX, props, state management, event handling, and React hooks.

      Throughout the course, you'll build several real-world projects that will help you understand how to apply React concepts in practical scenarios. By the end of this course, you'll have the skills needed to build modern, interactive web applications with React.`,
      whatYouWillLearn: [
        "Understand React components and JSX syntax",
        "Master props and state management",
        "Work with React hooks (useState, useEffect, useContext)",
        "Handle events and user interactions",
        "Build reusable components",
        "Implement routing with React Router",
        "Connect to APIs and manage data",
        "Deploy React applications",
      ],
      requirements: [
        "Basic knowledge of HTML, CSS, and JavaScript",
        "Familiarity with ES6+ JavaScript features",
        "A computer with internet connection",
        "Code editor (VS Code recommended)",
      ],
      modules: [
        {
          id: 1,
          title: "Getting Started with React",
          duration: "2 hours",
          lessons: [
            { id: 1, title: "What is React?", duration: "15 min", type: "video", completed: true },
            {
              id: 2,
              title: "Setting up the Development Environment",
              duration: "20 min",
              type: "video",
              completed: true,
            },
            { id: 3, title: "Your First React Component", duration: "25 min", type: "video", completed: false },
            { id: 4, title: "Understanding JSX", duration: "30 min", type: "reading", completed: false },
          ],
        },
        {
          id: 2,
          title: "Components and Props",
          duration: "3 hours",
          lessons: [
            { id: 5, title: "Creating Functional Components", duration: "25 min", type: "video", locked: true },
            { id: 6, title: "Working with Props", duration: "30 min", type: "video", locked: true },
            { id: 7, title: "Component Composition", duration: "35 min", type: "video", locked: true },
            { id: 8, title: "Props Quiz", duration: "10 min", type: "quiz", locked: true },
          ],
        },
        {
          id: 3,
          title: "State and Event Handling",
          duration: "4 hours",
          lessons: [
            { id: 9, title: "Introduction to State", duration: "20 min", type: "video", locked: true },
            { id: 10, title: "useState Hook", duration: "35 min", type: "video", locked: true },
            { id: 11, title: "Handling Events", duration: "30 min", type: "video", locked: true },
            { id: 12, title: "Building Interactive Components", duration: "45 min", type: "video", locked: true },
          ],
        },
      ],
    }

    setCourse(mockCourse)

    // Check if user is enrolled (mock check)
    setIsEnrolled(Math.random() > 0.5) // Random for demo
  }, [params.id, router])

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-4 w-4" />
      case "reading":
        return <BookOpen className="h-4 w-4" />
      case "quiz":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const handleEnroll = () => {
    setIsEnrolled(true)
    // In real app, this would call your Strapi API
  }

  if (!user || !course) {
    return <div>Loading...</div>
  }

  const canAccessContent = isEnrolled || user.role === "instructor" || user.role === "admin"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/courses" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Link>
            <Link href="/dashboard" className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">CPS Academy</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                <span className="text-sm text-gray-600">{course.category}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{course.description}</p>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{course.rating} rating</span>
                </div>
              </div>
            </div>

            {/* Course Content Tabs */}
            <Tabs defaultValue="overview" className="bg-white rounded-lg shadow-sm">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">About this course</h3>
                    <p className="text-gray-600 whitespace-pre-line">{course.fullDescription}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">What you'll learn</h3>
                    <ul className="space-y-2">
                      {course.whatYouWillLearn.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      {course.requirements.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="p-6">
                <div className="space-y-4">
                  {course.modules.map((module) => (
                    <Card key={module.id}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <span className="text-sm text-gray-600">{module.duration}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="flex items-center">
                                {lesson.locked && !canAccessContent ? (
                                  <Lock className="h-4 w-4 text-gray-400 mr-3" />
                                ) : lesson.completed ? (
                                  <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                                ) : (
                                  getTypeIcon(lesson.type)
                                )}
                                <span
                                  className={`${lesson.locked && !canAccessContent ? "text-gray-400" : "text-gray-700"}`}
                                >
                                  {lesson.title}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="instructor" className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-600">JS</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{course.instructor}</h3>
                    <p className="text-gray-600 mb-4">Senior React Developer & Instructor</p>
                    <p className="text-gray-600">
                      John is a seasoned React developer with over 8 years of experience building web applications. He
                      has worked with companies like Google and Facebook, and has taught thousands of students how to
                      master React development.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">${course.price}</div>
                  <p className="text-gray-600">One-time payment</p>
                </div>

                {isEnrolled ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center text-green-600 mb-4">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">You're enrolled!</span>
                    </div>
                    <Button className="w-full" size="lg">
                      Continue Learning
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {user.role === "student" ? (
                      <Button className="w-full" size="lg" onClick={handleEnroll}>
                        Enroll Now
                      </Button>
                    ) : (
                      <Button className="w-full" size="lg" variant="outline">
                        Preview Course
                      </Button>
                    )}
                    <p className="text-xs text-gray-500 text-center">30-day money-back guarantee</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level</span>
                  <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Students</span>
                  <span className="font-medium">{course.students.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-medium">{course.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">{course.category}</span>
                </div>
              </CardContent>
            </Card>

            {/* Share Course */}
            <Card>
              <CardHeader>
                <CardTitle>Share this course</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Copy Link
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
