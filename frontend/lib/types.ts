export interface User {
  id: number;
  username: string;
  email: string;
  role: "normal_user" | "social_media_manager" | "student";
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

export interface Module {
  id: string;
  name: string;
  description: string;
  classCount: number;
  topics: string[];
}
