export interface User {
  id: string
  name: string
  email: string
  role: "Unregistered" | "Normal User" | "Student" | "Social Media Manager"
}

export interface Course {
  id: string
  title: string
  description: string
  modules: Module[]
}

export interface Module {
  id: string
  name: string
  description: string
  classCount: number
  topics: string[]
}
