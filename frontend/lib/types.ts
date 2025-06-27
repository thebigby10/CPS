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

export interface Module {
  id: string;
  Name: string;
  Description: string;
  NumberOfClasses: number;
  TopicsCovered: string[];
}
