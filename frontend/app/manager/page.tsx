"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import { mockCourses, mockUsers } from "@/lib/mock-data";
import type { Course, Module, User, Enrollment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  fetchCourses,
  fetchUsers,
  createCourse,
  updateCourse,
  deleteCourse,
  createModule,
  updateModule,
  deleteModule,
  updateUserRole,
  enrollUser,
  unenrollUser,
  fetchEnrollments,
} from "@/lib/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Edit,
  Trash2,
  Plus,
  X,
  Users,
  Crown,
  GraduationCap,
  UserIcon,
  BookOpen,
} from "lucide-react";

interface CourseFormData {
  title: string;
  description: string;
}

interface ModuleFormData {
  name: string;
  description: string;
  classCount: number;
  topics: string[];
  courseId: string;
}

export default function ManagerPage() {
  const { user } = useUser();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [activeTab, setActiveTab] = useState<
    "courses" | "modules" | "users" | "enrollment"
  >("courses");

  // Course form states
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState<CourseFormData>({
    title: "",
    description: "",
  });

  // Module form states
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingModule, setEditingModule] = useState<{
    module: Module;
    courseId: string;
  } | null>(null);
  const [moduleForm, setModuleForm] = useState<ModuleFormData>({
    name: "",
    description: "",
    classCount: 0,
    topics: [],
    courseId: "",
  });
  const [topicInput, setTopicInput] = useState("");

  // User management states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | User["role"]>("all");
  const [editingUserRole, setEditingUserRole] = useState<User | null>(null);

  // Enrollment states
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete confirmation states
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "course" | "module" | "enrollment";
    id: string;
    courseId?: string;
    userId?: number;
  } | null>(null);

  useEffect(() => {
    if (!user || user.role !== "social_media_manager") {
      router.push("/");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [coursesData, usersData, enrollmentsData] = await Promise.all([
          fetchCourses(),
          fetchUsers(),
          fetchEnrollments(),
        ]);
        setCourses(coursesData);
        setUsers(usersData);
        setEnrollments(enrollmentsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, router]);

  if (!user || user.role !== "social_media_manager") {
    return null;
  }

  // Course CRUD operations
  const handleCreateCourse = async () => {
    if (!courseForm.title.trim() || !courseForm.description.trim()) return;

    try {
      const newCourse = await createCourse({
        Title: courseForm.title,
        Description: courseForm.description,
      });
      setCourses([...courses, newCourse]);
      setCourseForm({ title: "", description: "" });
      setShowCourseForm(false);
    } catch (error) {
      console.error("Failed to create course:", error);
      setError("Failed to create course. Please try again.");
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({ title: course.title, description: course.description });
    setShowCourseForm(true);
  };

  const handleUpdateCourse = async () => {
    if (
      !editingCourse ||
      !courseForm.title.trim() ||
      !courseForm.description.trim()
    )
      return;

    try {
      const updatedCourse = await updateCourse(editingCourse.id, {
        title: courseForm.title,
        description: courseForm.description,
      });

      setCourses(
        courses.map((course) =>
          course.id === editingCourse.id
            ? {
                ...course,
                title: updatedCourse.title,
                description: updatedCourse.description,
              }
            : course,
        ),
      );

      setEditingCourse(null);
      setCourseForm({ title: "", description: "" });
      setShowCourseForm(false);
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      setCourses(courses.filter((c) => c.id !== courseId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Failed to delete course. Please try again.");
    }
  };

  // Module CRUD operations
  const handleCreateModule = async () => {
    if (
      !moduleForm.name.trim() ||
      !moduleForm.description.trim() ||
      !moduleForm.courseId
    ) {
      return;
    }

    try {
      const newModule = await createModule({
        name: moduleForm.name,
        description: moduleForm.description,
        classCount: moduleForm.classCount,
        topics: moduleForm.topics,
        courseId: moduleForm.courseId,
      });

      setCourses(
        courses.map((course) =>
          course.id === moduleForm.courseId
            ? {
                ...course,
                modules: [...course.modules, newModule],
              }
            : course,
        ),
      );

      setModuleForm({
        name: "",
        description: "",
        classCount: 0,
        topics: [],
        courseId: "",
      });
      setShowModuleForm(false);
    } catch (error) {
      console.error("Failed to create module:", error);
      alert(error.message || "Failed to create module. Please try again.");
    }
  };

  const handleEditModule = (module: Module, courseId: string) => {
    setEditingModule({ module, courseId });
    setModuleForm({
      name: module.name,
      description: module.description,
      classCount: module.classCount,
      topics: [...module.topics],
      courseId,
    });
    setShowModuleForm(true);
  };

  const handleUpdateModule = async () => {
    if (
      !editingModule ||
      !moduleForm.name.trim() ||
      !moduleForm.description.trim()
    ) {
      return;
    }

    try {
      const updatedModule = await updateModule(editingModule.module.id, {
        name: moduleForm.name,
        description: moduleForm.description,
        classCount: moduleForm.classCount,
        topics: moduleForm.topics,
        courseId: editingModule.courseId,
      });

      setCourses(
        courses.map((course) =>
          course.id === editingModule.courseId
            ? {
                ...course,
                modules: course.modules.map((module) =>
                  module.id === editingModule.module.id
                    ? updatedModule
                    : module,
                ),
              }
            : course,
        ),
      );

      setEditingModule(null);
      setModuleForm({
        name: "",
        description: "",
        classCount: 0,
        topics: [],
        courseId: "",
      });
      setShowModuleForm(false);
    } catch (error) {
      console.error("Failed to update module:", error);
      alert(error.message || "Failed to update module");
    }
  };

  const handleDeleteModule = async (courseId: string, moduleId: string) => {
    try {
      await deleteModule(moduleId);
      setCourses(
        courses.map((course) =>
          course.id === courseId
            ? {
                ...course,
                modules: course.modules.filter((m) => m.id !== moduleId),
              }
            : course,
        ),
      );
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete module:", error);
      alert(error.message || "Failed to delete module");
    }
  };

  // User role management
  const handleUpdateUserRole = async (userId: string, newRoleId: number) => {
    try {
      const updatedUser = await updateUserRole(userId, newRoleId);
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
      setEditingUserRole(null);
    } catch (error: any) {
      console.error("Failed to update user role:", error);
      alert(error.message || "Failed to update user role");
    }
  };

  // Enrollment operations
  const handleEnrollUser = async () => {
    if (!selectedUser || !selectedCourse) return;

    try {
      await enrollUser(selectedUser, selectedCourse);
      setEnrollments([
        ...enrollments,
        {
          id: `${selectedCourse}-${selectedUser}`,
          userId: selectedUser,
          courseId: selectedCourse,
          enrolledAt: new Date().toISOString(),
        },
      ]);
      setSelectedUser(null);
      setSelectedCourse(null);
    } catch (error) {
      console.error("Failed to enroll user:", error);
      setError("Failed to enroll user. Please try again.");
    }
  };

  const handleUnenrollUser = async (
    enrollmentId: string,
    userId: number,
    courseId: string,
  ) => {
    try {
      await unenrollUser(userId, courseId);
      setEnrollments(enrollments.filter((e) => e.id !== enrollmentId));
    } catch (error) {
      console.error("Failed to unenroll user:", error);
      setError("Failed to unenroll user. Please try again.");
    }
  };

  // Helper functions
  const addTopic = () => {
    if (topicInput.trim() && !moduleForm.topics.includes(topicInput.trim())) {
      setModuleForm({
        ...moduleForm,
        topics: [...moduleForm.topics, topicInput.trim()],
      });
      setTopicInput("");
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setModuleForm({
      ...moduleForm,
      topics: moduleForm.topics.filter((topic) => topic !== topicToRemove),
    });
  };

  const resetForms = () => {
    setShowCourseForm(false);
    setShowModuleForm(false);
    setEditingCourse(null);
    setEditingModule(null);
    setCourseForm({ title: "", description: "" });
    setModuleForm({
      name: "",
      description: "",
      classCount: 0,
      topics: [],
      courseId: "",
    });
    setTopicInput("");
  };

  // Filter users based on search and role
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter == "all" || u.role == roleFilter;
    return matchesSearch && matchesRole;
  });

  // Get role statistics
  const roleStats = {
    total: users.length,
    students: users.filter((u) => u.role == "student").length,
    normalUsers: users.filter((u) => u.role == "normal_user").length,
    managers: users.filter((u) => u.role == "social_media_manager").length,
  };

  const getRoleIcon = (role: User["role"]) => {
    switch (role) {
      case "student":
        return <GraduationCap className="w-4 h-4" />;
      case "social_media_manager":
        return <Crown className="w-4 h-4" />;
      default:
        return <UserIcon className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: User["role"]) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-800";
      case "social_media_manager":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manager Panel</h1>
        <p className="text-gray-600">
          Manage courses, modules, users, and enrollments
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("courses")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "courses"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => setActiveTab("modules")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "modules"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Modules
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === "users"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Users</span>
            </button>
            <button
              onClick={() => setActiveTab("enrollment")}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === "enrollment"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Enrollments</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this {deleteConfirm.type}? This
              action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="destructive"
                onClick={() => {
                  if (deleteConfirm.type === "course") {
                    handleDeleteCourse(deleteConfirm.id);
                  } else if (deleteConfirm.type === "module") {
                    handleDeleteModule(
                      deleteConfirm.courseId!,
                      deleteConfirm.id,
                    );
                  } else if (deleteConfirm.type === "enrollment") {
                    handleUnenrollUser(
                      deleteConfirm.id,
                      deleteConfirm.userId!,
                      deleteConfirm.courseId!,
                    );
                  }
                }}
              >
                Delete
              </Button>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Role Update Modal */}
      {editingUserRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Update User Role</h3>
            <p className="text-gray-600 mb-4">
              Change role for <strong>{editingUserRole.name}</strong> (
              {editingUserRole.email})
            </p>
            <div className="space-y-3 mb-6">
              {(
                [
                  "normal_user",
                  "student",
                  "social_media_manager",
                ] as User["role"][]
              ).map((role) => (
                <label
                  key={role}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={editingUserRole.role === role}
                    onChange={() =>
                      setEditingUserRole({ ...editingUserRole, role })
                    }
                    className="text-blue-600"
                  />
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(role)}
                    <span>{role}</span>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() =>
                  handleUpdateUserRole(
                    editingUserRole.id.toString(),
                    editingUserRole.role === "student"
                      ? 2
                      : editingUserRole.role === "social_media_manager"
                        ? 3
                        : 1,
                  )
                }
              >
                Update Role
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingUserRole(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === "courses" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Courses</h2>
            <Button onClick={() => setShowCourseForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </div>

          {/* Course Form */}
          {showCourseForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {editingCourse ? "Edit Course" : "Add New Course"}
                </CardTitle>
                <CardDescription>
                  {editingCourse
                    ? "Update course information"
                    : "Create a new course for the platform"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="course-title">Course Title</Label>
                  <Input
                    id="course-title"
                    value={courseForm.title}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, title: e.target.value })
                    }
                    placeholder="Enter course title"
                  />
                </div>
                <div>
                  <Label htmlFor="course-description">Description</Label>
                  <textarea
                    id="course-description"
                    value={courseForm.description}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter course description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={
                      editingCourse ? handleUpdateCourse : handleCreateCourse
                    }
                  >
                    {editingCourse ? "Update Course" : "Create Course"}
                  </Button>
                  <Button variant="outline" onClick={resetForms}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {course.modules.length} modules
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCourse(course)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setDeleteConfirm({ type: "course", id: course.id })
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modules Tab */}
      {activeTab === "modules" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              All Modules
            </h2>
            <Button onClick={() => setShowModuleForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Module
            </Button>
          </div>

          {/* Module Form */}
          {showModuleForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {editingModule ? "Edit Module" : "Add New Module"}
                </CardTitle>
                <CardDescription>
                  {editingModule
                    ? "Update module information"
                    : "Create a new module for a course"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="module-course">Course</Label>
                  <select
                    id="module-course"
                    value={moduleForm.courseId}
                    onChange={(e) =>
                      setModuleForm({ ...moduleForm, courseId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!!editingModule}
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="module-name">Module Name</Label>
                  <Input
                    id="module-name"
                    value={moduleForm.name}
                    onChange={(e) =>
                      setModuleForm({ ...moduleForm, name: e.target.value })
                    }
                    placeholder="Enter module name"
                  />
                </div>
                <div>
                  <Label htmlFor="module-description">Description</Label>
                  <textarea
                    id="module-description"
                    value={moduleForm.description}
                    onChange={(e) =>
                      setModuleForm({
                        ...moduleForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter module description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="class-count">Number of Classes</Label>
                  <Input
                    id="class-count"
                    type="number"
                    value={moduleForm.classCount}
                    onChange={(e) =>
                      setModuleForm({
                        ...moduleForm,
                        classCount: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter number of classes"
                    min="0"
                  />
                </div>
                <div>
                  <Label>Topics</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      placeholder="Enter a topic"
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTopic())
                      }
                    />
                    <Button type="button" onClick={addTopic}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {moduleForm.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {topic}
                        <button
                          type="button"
                          onClick={() => removeTopic(topic)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={
                      editingModule ? handleUpdateModule : handleCreateModule
                    }
                  >
                    {editingModule ? "Update Module" : "Create Module"}
                  </Button>
                  <Button variant="outline" onClick={resetForms}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Modules by Course */}
          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course.id}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {course.title}
                </h3>
                {course.modules.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {course.modules.map((module) => (
                      <Card key={module.id}>
                        <CardHeader>
                          <CardTitle className="text-base">
                            {module.name}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {module.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">
                                {module.classCount} classes
                              </span>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleEditModule(module, course.id)
                                  }
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    setDeleteConfirm({
                                      type: "module",
                                      id: module.id,
                                      courseId: course.id,
                                    })
                                  }
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {module.topics.slice(0, 3).map((topic, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {topic}
                                </span>
                              ))}
                              {module.topics.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{module.topics.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No modules in this course yet.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold">{roleStats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Students</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {roleStats.students}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Normal Users</p>
                    <p className="text-2xl font-bold text-gray-600">
                      {roleStats.normalUsers}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Managers</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {roleStats.managers}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value as typeof roleFilter)
                }
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="normal_user">Normal Users</option>
                <option value="student">Students</option>
                <option value="social_media_manager">Managers</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Registered Users</CardTitle>
              <CardDescription>
                Manage user roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        User
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Role
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {u.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">
                              {u.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{u.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(u.role)}`}
                          >
                            {getRoleIcon(u.role)}
                            <span>{u.role}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingUserRole(u)}
                            disabled={u.id === user.id}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit Role
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No users found matching your criteria.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enrollment Tab */}
      {activeTab === "enrollment" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Enrollment</CardTitle>
              <CardDescription>Enroll users in courses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Select User</Label>
                  <select
                    value={selectedUser || ""}
                    onChange={(e) => setSelectedUser(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Select Course</Label>
                  <select
                    value={selectedCourse || ""}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Button
                onClick={handleEnrollUser}
                disabled={!selectedUser || !selectedCourse}
              >
                <Plus className="w-4 h-4 mr-2" />
                Enroll User
              </Button>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">
                  Current Enrollments
                </h3>
                {enrollments.length === 0 ? (
                  <p className="text-gray-500">No enrollments yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">User</th>
                          <th className="text-left py-3 px-4">Course</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrollments.map((enrollment) => {
                          const user = users.find(
                            (u) => u.id == enrollment.userId,
                          );
                          const course = courses.find(
                            (c) => c.id == enrollment.courseId,
                          );
                          return (
                            <tr
                              key={enrollment.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">
                                {user
                                  ? `${user.name} (${user.email})`
                                  : "Unknown user"}
                              </td>
                              <td className="py-3 px-4">
                                {course ? course.title : "Unknown course"}
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    setDeleteConfirm({
                                      type: "enrollment",
                                      id: enrollment.id,
                                      userId: enrollment.userId,
                                      courseId: enrollment.courseId,
                                    })
                                  }
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Unenroll
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
