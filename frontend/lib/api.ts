const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// export async function fetchCourses(): Promise<Course[]> {
//   const jwt = localStorage.getItem("jwt");
//   const res = await fetch(`${API_URL}/api/courses?populate=modules`, {
//     credentials: "include",
//     headers: {
//       Authorization: `Bearer ${jwt}`,
//     },
//   });
//   const data = await res.json();

//   // data.data.map((item: any) => {
//   //   console.log(item.id, item.Title, item.Description);
//   // });
//   // console.log(data.data);
//   return data.data.map((item: any) => ({
//     id: item.documentId,
//     title: item.Title,
//     description: item.Description,
//     modules:
//       item.modules?.data?.map((module: any) => ({
//         id: module.id.toString(),
//         name: module.Name,
//         description: module.Details,
//         classCount: module.NumberOfClasses,
//         topics: module.TopicsCovered || [],
//       })) || [],
//   }));
//   // console.log(data);
// }
//
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
  return data.map((user: any) => ({
    id: user.id.toString(),
    name: user.username,
    email: user.email,
    role: user.role?.name || "normal_user",
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

// Create a new module
// export const createModule = async (moduleData: {
//   name: string;
//   description: string;
//   classCount: number;
//   topics: string[];
//   courseId: string;
// }): Promise<Module> => {
//   const res = await fetch(`${API_URL}/api/modules`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${localStorage.getItem("jwt") || ""}`,
//     },
//     body: JSON.stringify({
//       data: {
//         Name: moduleData.name,
//         Details: moduleData.description,
//         NumberOfClasses: moduleData.classCount,
//         TopicsCovered: moduleData.topics,
//         course: moduleData.courseId,
//       },
//     }),
//   });
//   const data = await res.json();
//   console.log("data send?");
//   return {
//     id: data.data.id,
//     name: data.data.name,
//     Details: data.data.description,
//     classCount: data.data.classCount,
//     topics: data.data.topics,
//   };
// };
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

// Update a module
// export const updateModule = async (
//   id: string,
//   moduleData: {
//     name: string;
//     description: string;
//     classCount: number;
//     topics: string[];
//     courseId: string;
//   },
// ): Promise<Module> => {
//   const res = await fetch(`${API_URL}/api/modules/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${localStorage.getItem("jwt") || ""}`,
//     },
//     body: JSON.stringify({
//       data: {
//         name: moduleData.name,
//         description: moduleData.description,
//         classCount: moduleData.classCount,
//         topics: moduleData.topics,
//         course: moduleData.courseId,
//       },
//     }),
//   });
//   const data = await res.json();
//   return {
//     id: data.data.id,
//     name: data.data.attributes.name,
//     description: data.data.attributes.description,
//     classCount: data.data.attributes.classCount,
//     topics: data.data.attributes.topics,
//   };
// };
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

// Delete a module
// export const deleteModule = async (id: string): Promise<void> => {
//   await fetch(`${API_URL}/api/modules/${id}`, {
//     method: "DELETE",
//     Authorization: `Bearer ${localStorage.getItem("jwt") || ""}`,
//   });
// };
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

// Update user role
// export const updateUserRole = async (
//   id: string,
//   role: User["role"],
// ): Promise<User> => {
//   console.log(role);
//   const res = await fetch(`${API_URL}/api/users/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${localStorage.getItem("jwt") || ""}`,
//     },
//     body: JSON.stringify({
//       role,
//     }),
//   });
//   const data = await res.json();
//   return {
//     id: data.id,
//     name: data.username,
//     email: data.email,
//     role: data.role,
//   };
// };
export const updateUserRole = async (
  id: string,
  role: User["role"],
): Promise<User> => {
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt") || ""}`,
    },
    body: JSON.stringify({
      role, // Remove data wrapper if your API doesn't expect it
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update user role");
  }

  const data = await res.json();

  // Ensure you're returning a properly formatted User object
  return {
    id: data.id || id, // Fallback to original id if not in response
    name: data.username || data.name || "", // Handle different response formats
    email: data.email || "",
    role: data.role || role, // Fallback to original role if not in response
  };
};

// export async function fetchCurrentUserCourses(): Promise<Course[]> {
//   const jwt = localStorage.getItem("jwt");
//   if (!jwt) {
//     throw new Error("No JWT token found");
//   }

//   const res = await fetch(`${API_URL}/api/users/me?populate=courses`, {
//     credentials: "include",
//     headers: {
//       Authorization: `Bearer ${jwt}`,
//     },
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch user courses");
//   }

//   const data = await res.json();

//   return (
//     data.courses?.map((course: any) => ({
//       id: course.documentId,
//       title: course.Title,
//       description: course.Description,
//       modules: [], // You might want to populate this if needed
//     })) || []
//   );
// }

export async function fetchCurrentUserCourses(): Promise<Course[]> {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    throw new Error("No JWT token found");
  }

  const res = await fetch(`${API_URL}/api/users/me?populate=courses`, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user courses");
  }

  const data = await res.json();

  // Create a map to filter out duplicates by documentId
  const coursesMap = new Map<string, Course>();

  data.courses?.forEach((course: any) => {
    // Only add the course if we haven't seen this documentId before
    if (!coursesMap.has(course.documentId)) {
      // Fixed: Added missing parenthesis
      coursesMap.set(course.documentId, {
        id: course.documentId,
        title: course.Title,
        description: course.Description,
        modules: [], // You might want to populate this if needed
      });
    }
  });

  return Array.from(coursesMap.values());
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
