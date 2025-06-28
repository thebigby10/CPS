"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/course-card";
import { useUser } from "@/contexts/user-context";
import { fetchCourses } from "@/lib/api";
import { Course } from "@/lib/types";

export default function HomePage() {
  const { user } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const fetchedCourses = await fetchCourses();
        setCourses(fetchedCourses);
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Master Competitive Programming
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Enhance your problem-solving skills with our comprehensive courses
          designed for competitive programming success.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Available Courses
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center p-4 bg-red-50 rounded-lg text-red-600">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} interactive={false} />
            ))}
          </div>
        )}
      </div>

      {(!user || user.role === "normal_user") && (
        <div className="text-center mt-12 p-8 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ready to Start Learning?
          </h3>
          <p className="text-gray-600 mb-4">
            Register as a student to access course content and track your
            progress.
          </p>
        </div>
      )}
    </div>
  );
}
