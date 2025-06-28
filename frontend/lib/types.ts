export interface User {
  id: number;
  username: string;
  email: string;
  role: "normal_user" | "social_media_manager" | "student";
}

export interface Course {
  id: string;
  Title: string;
  Description: string;
  modules: Module[];
}

type Module = {
  id: string;
  name: string;
  description: string;
  classCount: number;
  topics: string[];
};

export interface Enrollment {
  id: string;
  userId: number;
  courseId: string;
  enrolledAt: string;
}
