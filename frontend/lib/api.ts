const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function fetchCourses(): Promise<Course[]> {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${API_URL}/api/courses?populate=modules`, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  const data = await res.json();

  // data.data.map((item: any) => {
  //   console.log(item.id, item.Title, item.Description);
  // });
  // console.log(data.data);
  return data.data.map((item: any) => ({
    id: item.documentId,
    title: item.Title,
    description: item.Description,
    modules:
      item.modules?.data?.map((module: any) => ({
        id: module.id.toString(),
        name: module.Name,
        description: module.Details,
        classCount: module.NumberOfClasses,
        topics: module.TopicsCovered || [],
      })) || [],
  }));
  // console.log(data);
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
        Details: moduleData.description,
        NumberOfClasses: moduleData.classCount,
        TopicsCovered: moduleData.topics,
        course: moduleData.courseId,
      },
    }),
  });
  const data = await res.json();
  console.log("data send?");
  return {
    id: data.data.id,
    name: data.data.name,
    Details: data.data.description,
    classCount: data.data.classCount,
    topics: data.data.topics,
  };
};

// Update a module
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
        name: moduleData.name,
        description: moduleData.description,
        classCount: moduleData.classCount,
        topics: moduleData.topics,
        course: moduleData.courseId,
      },
    }),
  });
  const data = await res.json();
  return {
    id: data.data.id,
    name: data.data.attributes.name,
    description: data.data.attributes.description,
    classCount: data.data.attributes.classCount,
    topics: data.data.attributes.topics,
  };
};

// Delete a module
export const deleteModule = async (id: string): Promise<void> => {
  await fetch(`${API_URL}/api/modules/${id}`, {
    method: "DELETE",
    Authorization: `Bearer ${localStorage.getItem("jwt") || ""}`,
  });
};

// Update user role
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
      role,
    }),
  });
  const data = await res.json();
  return {
    id: data.id,
    name: data.username,
    email: data.email,
    role: data.role,
  };
};
