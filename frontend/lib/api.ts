const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function fetchCourses(): Promise<Course[]> {
  const jwt = localStorage.getItem("jwt");
  let res;
  if (!jwt) {
    res = await fetch(`${API_URL}/api/courses?populate=modules`, {
      credentials: "include",
      headers: {},
    });
  } else {
    res = await fetch(`${API_URL}/api/courses?populate=modules`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
  }
  const data = await res.json();

  return data.data.map((course: any) => ({
    id: course.documentId,
    title: course.Title,
    description: course.Description,
    modules:
      course.modules?.map((module: any) => ({
        id: module.documentId,
        name: module.Name,
        description: module.Details[0]?.children[0]?.text || "", // Extract text from rich text
        classCount: module.NumberOfClasses,
        topics: module.TopicsCovered[0]?.children[0]?.text
          ? module.TopicsCovered[0].children[0].text.split(", ")
          : [],
      })) || [],
  }));
}

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_URL}/api/users?populate=role`, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt") || ""}`,
    },
  });
  const data = await res.json();
  // console.log(`${API_URL}/api/users`);
  // console.log(res.status);
  // console.log(data);
  console.log(data[0].role);
  return data.map((user: any) => ({
    id: user.id.toString(),
    name: user.username,
    email: user.email,
    role: user.role?.type || "normal_user",
  }));
}

// Create a new course
export const createCourse = async (courseData: {
  Title: string;
  Description: string;
}): Promise<Course> => {
  const res = await fetch(`${API_URL}/api/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt") || ""}`,
    },
    body: JSON.stringify({
      data: {
        Title: courseData.Title,
        Description: courseData.Description,
      },
    }),
  });
  const data = await res.json();
  return {
    id: data.data.id,
    title: data.data.Title,
    description: data.data.Description,
    modules: [],
  };
};

// Update a course
export const updateCourse = async (
  id: string,
  courseData: { title: string; description: string },
): Promise<Course> => {
  console.log(id);
  const res = await fetch(`${API_URL}/api/courses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt") || ""}`,
    },
    body: JSON.stringify({
      data: {
        Title: courseData.title,
        Description: courseData.description,
      },
    }),
  });
  const data = await res.json();
  return {
    id: data.data.id,
    title: data.data.Title,
    description: data.data.Description,
    modules:
      data.data.modules?.data?.map((module: any) => ({
        id: module.id,
        name: module.name,
        description: module.description,
        classCount: module.classCount,
        topics: module.topics,
      })) || [],
  };
};

// Delete a course
export const deleteCourse = async (id: string): Promise<void> => {
  console.log(id);
  await fetch(`${API_URL}/api/courses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt") || ""}`,
    },
  });
};

export const createModule = async (moduleData: {
  name: string;
  description: string;
  classCount: number;
  topics: string[];
  courseId: string;
}): Promise<Module> => {
  const res = await fetch(`${API_URL}/api/modules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt") || ""}`,
    },
    body: JSON.stringify({
      data: {
        Name: moduleData.name,
        Details: [
          {
            type: "paragraph",
            children: [{ type: "text", text: moduleData.description }],
          },
        ],
        NumberOfClasses: moduleData.classCount,
        TopicsCovered: [
          {
            type: "paragraph",
            children: [{ type: "text", text: moduleData.topics.join(", ") }],
          },
        ],
        course: moduleData.courseId,
      },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Failed to create module");
  }

  // Map the API response to your Module type
  return {
    id: data.data.id.toString(), // Convert number to string if needed
    name: data.data.Name,
    description: data.data.Details[0]?.children[0]?.text || "", // Extract text from rich text format
    classCount: data.data.NumberOfClasses,
    topics: data.data.TopicsCovered[0]?.children[0]?.text
      ? data.data.TopicsCovered[0].children[0].text.split(", ")
      : [],
  };
};

export const updateModule = async (
  id: string,
  moduleData: {
    name: string;
    description: string;
    classCount: number;
    topics: string[];
    courseId: string;
  },
): Promise<Module> => {
  const res = await fetch(`${API_URL}/api/modules/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt") || ""}`,
    },
    body: JSON.stringify({
      data: {
        Name: moduleData.name, // Changed to match API's expected 'Name'
        Details: [
          {
            // Changed to rich text format
            type: "paragraph",
            children: [
              {
                type: "text",
                text: moduleData.description,
              },
            ],
          },
        ],
        NumberOfClasses: moduleData.classCount, // Changed to match API
        TopicsCovered: [
          {
            // Changed to rich text format
            type: "paragraph",
            children: [
              {
                type: "text",
                text: moduleData.topics.join(", "), // Convert array to string
              },
            ],
          },
        ],
        course: moduleData.courseId,
      },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Failed to update module");
  }

  // Map API response back to frontend format
  return {
    id: data.data.id.toString(),
    name: data.data.Name, // API's 'Name' → frontend's 'name'
    description: data.data.Details[0]?.children[0]?.text || "",
    classCount: data.data.NumberOfClasses,
    topics: data.data.TopicsCovered[0]?.children[0]?.text
      ? data.data.TopicsCovered[0].children[0].text.split(", ")
      : [],
  };
};

export const deleteModule = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/api/modules/${id}`, {
    method: "DELETE",
    headers: {
      // Fixed: headers should be in a headers object
      Authorization: `Bearer ${localStorage.getItem("jwt") || ""}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete module");
  }
};

export const updateUserRole = async (
  id: string,
  roleId: number, // Use role ID instead of role name
): Promise<User> => {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt || ""}`,
    },
    body: JSON.stringify({
      data: {
        role: roleId,
      },
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Failed to update user role");
  }

  const data = await res.json();

  return {
    id: data.id || id,
    name: data.username || data.name || "",
    email: data.email || "",
    role: data.role?.name || "", // You can keep role ID if preferred
  };
};
export async function fetchCurrentUserCourses(): Promise<Course[]> {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    throw new Error("No JWT token found");
  }

  // First fetch the user's enrolled courses
  const userRes = await fetch(`${API_URL}/api/users/me?populate=courses`, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!userRes.ok) {
    throw new Error("Failed to fetch user courses");
  }

  const userData = await userRes.json();

  // Create a map to filter out duplicates by documentId
  const coursesMap = new Map<string, Course>();

  // Get all unique course IDs first
  userData.courses?.forEach((course: any) => {
    if (!coursesMap.has(course.documentId)) {
      coursesMap.set(course.documentId, {
        id: course.documentId,
        title: course.Title,
        description: course.Description,
        modules: [], // Temporary empty array
      });
    }
  });

  // Now fetch each course with modules populated
  const coursesWithModules = await Promise.all(
    Array.from(coursesMap.values()).map(async (course) => {
      const courseRes = await fetch(
        `${API_URL}/api/courses/${course.id}?populate=modules`,
        {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      if (!courseRes.ok) {
        console.error(`Failed to fetch modules for course ${course.id}`);
        return course; // Return course without modules if fetch fails
      }

      const courseData = await courseRes.json();

      return {
        ...course,
        modules:
          courseData.data.modules?.map((module: any) => ({
            id: module.documentId,
            name: module.Name,
            description: module.Details[0]?.children[0]?.text || "",
            classCount: module.NumberOfClasses,
            topics: module.TopicsCovered[0]?.children[0]?.text
              ? module.TopicsCovered[0].children[0].text.split(", ")
              : [],
          })) || [],
      };
    }),
  );

  return coursesWithModules;
}

export async function fetchCourseById(id: string): Promise<Course> {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${API_URL}/api/courses/${id}?populate=modules`, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${jwt || ""}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch course");
  }

  const data = await res.json();
  console.log(data.data);
  return {
    id: data.data.documentId,
    title: data.data.Title,
    description: data.data.Description,
    modules:
      data.data.modules?.map((module: any) => ({
        id: module.documentId,
        name: module.Name,
        description: module.Details[0]?.children[0]?.text || "",
        classCount: module.NumberOfClasses,
        topics: module.TopicsCovered[0]?.children[0]?.text
          ? module.TopicsCovered[0].children[0].text.split(", ")
          : [],
      })) || [],
  };
}

// new files
//
//
// Add to api.ts

// Fetch enrollments
export async function fetchEnrollments(): Promise<Enrollment[]> {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${API_URL}/api/courses?populate=users`, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${jwt || ""}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch enrollments");
  }

  const data = await res.json();

  // console.log(data.data);

  // Transform the data into Enrollment array
  const enrollments: Enrollment[] = [];
  data.data.forEach((course: any) => {
    course.users?.forEach((user: any) => {
      enrollments.push({
        id: `${course.id}-${user.id}`,
        userId: user.id,
        courseId: course.documentId,
        enrolledAt: new Date().toISOString(), // You might want to get this from the API if available
      });
    });
  });

  // console.log("Users:", users);
  // console.log("Courses:", courses);
  // console.log(users);
  // enrollments.forEach((data) => {
  //   console.log(data.userId);
  //   console.log(data.courseId);
  //   console.log();
  // });
  // console.log("Enrollments:", enrollments);

  return enrollments;
}

// Enroll user in course
export async function enrollUser(
  userId: number,
  courseId: string,
): Promise<void> {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${API_URL}/api/courses/${courseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt || ""}`,
    },
    body: JSON.stringify({
      data: {
        users: {
          connect: [userId],
        },
      },
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Failed to enroll user");
  }
}

// Unenroll user from course
export async function unenrollUser(
  userId: number,
  courseId: string,
): Promise<void> {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${API_URL}/api/courses/${courseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt || ""}`,
    },
    body: JSON.stringify({
      data: {
        users: {
          disconnect: [userId],
        },
      },
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Failed to unenroll user");
  }
}
