"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  Award,
  Plus,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserType {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "student" | "instructor" | "admin";
}

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  students: number;
  status: "active" | "draft";
  progress?: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/auth/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Mock courses based on role
    const mockCourses: Course[] = [
      {
        id: 1,
        title: "React Fundamentals",
        description: "Learn the basics of React development",
        instructor: "John Smith",
        students: 45,
        status: "active",
        progress: 75,
      },
      {
        id: 2,
        title: "Advanced JavaScript",
        description: "Master advanced JavaScript concepts",
        instructor: "Jane Doe",
        students: 32,
        status: "active",
        progress: 30,
      },
      {
        id: 3,
        title: "Node.js Backend Development",
        description: "Build scalable backend applications",
        instructor: "Mike Johnson",
        students: 28,
        status: "draft",
        progress: 0,
      },
    ];

    setCourses(mockCourses);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "instructor":
        return "bg-blue-100 text-blue-800";
      case "student":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatsForRole = () => {
    switch (user.role) {
      case "admin":
        return [
          { title: "Total Courses", value: "156", icon: BookOpen },
          { title: "Total Users", value: "2,847", icon: Users },
          { title: "Active Instructors", value: "23", icon: User },
          { title: "Certificates Issued", value: "1,234", icon: Award },
        ];
      case "instructor":
        return [
          { title: "My Courses", value: "8", icon: BookOpen },
          { title: "Total Students", value: "342", icon: Users },
          { title: "Avg. Rating", value: "4.8", icon: Award },
          { title: "Course Views", value: "12.5k", icon: User },
        ];
      case "student":
        return [
          { title: "Enrolled Courses", value: "12", icon: BookOpen },
          { title: "Completed", value: "8", icon: Award },
          { title: "In Progress", value: "4", icon: Users },
          { title: "Certificates", value: "6", icon: Award },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">
                  CPS Academy
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getRoleColor(user.role)}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
              <span className="text-sm text-gray-700">
                {user.firstName || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName || user.email}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user.role === "admin" &&
              "Manage your academy from this dashboard."}
            {user.role === "instructor" &&
              "Track your courses and student progress."}
            {user.role === "student" && "Continue your learning journey."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getStatsForRole().map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses Section */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {user.role === "student"
                  ? "My Courses"
                  : user.role === "instructor"
                    ? "My Courses"
                    : "Recent Courses"}
              </h2>
              {(user.role === "instructor" || user.role === "admin") && (
                <Link href="/courses/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                  </Button>
                </Link>
              )}
            </div>

            <div className="space-y-4">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {course.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Instructor: {course.instructor} • {course.students}{" "}
                          students
                        </p>
                      </div>
                      <Badge
                        variant={
                          course.status === "active" ? "default" : "secondary"
                        }
                      >
                        {course.status}
                      </Badge>
                    </div>

                    {user.role === "student" &&
                      course.progress !== undefined && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                    <div className="flex space-x-2">
                      <Link href={`/courses/${course.id}`}>
                        <Button variant="outline" size="sm">
                          {user.role === "student"
                            ? "Continue"
                            : "View Details"}
                        </Button>
                      </Link>
                      {(user.role === "instructor" ||
                        user.role === "admin") && (
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/courses" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Courses
                  </Button>
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin/users" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                  </Link>
                )}
                <Link href="/profile" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Completed "React Hooks" lesson</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Earned "JavaScript Expert" badge</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                    <span>Started "Node.js Fundamentals"</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
