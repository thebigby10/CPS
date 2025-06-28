"use client";

import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import ModuleCard from "@/components/module-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchCourseById } from "@/lib/api"; // We'll need to add this function

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/");
      return;
    }

    const loadCourse = async () => {
      try {
        const courseData = await fetchCourseById(params.id as string);
        setCourse(courseData);
      } catch (err) {
        setError("Failed to load course data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [user, router, params.id]);

  if (!user || user.role !== "student") {
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-red-600">{error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {course.title}
        </h1>
        <p className="text-gray-600 text-lg">{course.description}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Course Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {course.modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </div>
    </div>
  );
}
