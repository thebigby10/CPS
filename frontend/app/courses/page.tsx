"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import CourseCard from "@/components/course-card";
import { useEffect, useState } from "react";
import { fetchCurrentUserCourses } from "@/lib/api"; // You'll need to add this function to your api.ts

export default function CoursesPage() {
  const { user } = useUser();
  const router = useRouter();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/");
      return;
    }

    const loadCourses = async () => {
      try {
        const courses = await fetchCurrentUserCourses();
        setEnrolledCourses(courses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [user, router]);

  if (!user || user.role !== "student") {
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
        <p className="text-gray-600">Continue your learning journey</p>
      </div>

      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              interactive={true}
              onClick={() => router.push(`/courses/${course.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            You are not enrolled in any courses yet.
          </p>
        </div>
      )}
    </div>
  );
}
