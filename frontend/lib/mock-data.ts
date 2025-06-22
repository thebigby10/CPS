import type { Course, User } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Student",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Social Media Manager",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "Normal User",
  },
  {
    id: "4",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Student",
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "Normal User",
  },
  {
    id: "6",
    name: "Diana Prince",
    email: "diana@example.com",
    role: "Student",
  },
  {
    id: "7",
    name: "Edward Norton",
    email: "edward@example.com",
    role: "Normal User",
  },
  {
    id: "8",
    name: "Fiona Green",
    email: "fiona@example.com",
    role: "Student",
  },
]

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Data Structures and Algorithms",
    description: "Master fundamental data structures and algorithms essential for competitive programming.",
    modules: [
      {
        id: "1",
        name: "Arrays and Strings",
        description: "Learn about array manipulation, string processing, and basic algorithms.",
        classCount: 8,
        topics: ["Array traversal", "Two pointers", "Sliding window", "String matching", "KMP algorithm"],
      },
      {
        id: "2",
        name: "Linked Lists and Stacks",
        description: "Understanding linear data structures and their applications.",
        classCount: 6,
        topics: ["Singly linked lists", "Doubly linked lists", "Stack operations", "Queue implementation"],
      },
      {
        id: "3",
        name: "Trees and Graphs",
        description: "Explore hierarchical and network data structures.",
        classCount: 12,
        topics: ["Binary trees", "BST operations", "Graph traversal", "DFS", "BFS", "Shortest paths"],
      },
    ],
  },
  {
    id: "2",
    title: "Dynamic Programming",
    description: "Learn advanced problem-solving techniques using dynamic programming.",
    modules: [
      {
        id: "4",
        name: "Introduction to DP",
        description: "Basic concepts and principles of dynamic programming.",
        classCount: 5,
        topics: ["Memoization", "Tabulation", "Optimal substructure", "Overlapping subproblems"],
      },
      {
        id: "5",
        name: "Classic DP Problems",
        description: "Solve well-known dynamic programming problems.",
        classCount: 10,
        topics: ["Fibonacci", "Knapsack", "LCS", "LIS", "Edit distance", "Coin change"],
      },
    ],
  },
  {
    id: "3",
    title: "Graph Theory",
    description: "Deep dive into graph algorithms and their competitive programming applications.",
    modules: [
      {
        id: "6",
        name: "Graph Fundamentals",
        description: "Basic graph concepts and representations.",
        classCount: 7,
        topics: ["Graph representation", "Adjacency matrix", "Adjacency list", "Graph properties"],
      },
      {
        id: "7",
        name: "Advanced Graph Algorithms",
        description: "Complex graph algorithms for competitive programming.",
        classCount: 15,
        topics: ["Dijkstra", "Floyd-Warshall", "MST", "Topological sort", "Strongly connected components"],
      },
    ],
  },
  {
    id: "4",
    title: "Number Theory",
    description: "Mathematical foundations for competitive programming problems.",
    modules: [
      {
        id: "8",
        name: "Prime Numbers and GCD",
        description: "Working with prime numbers and greatest common divisors.",
        classCount: 6,
        topics: ["Sieve of Eratosthenes", "Prime factorization", "GCD", "LCM", "Modular arithmetic"],
      },
    ],
  },
]

// Mock enrolled courses for students
export const mockEnrolledCourses = ["1", "2"] // Student is enrolled in first two courses
