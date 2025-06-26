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
    id: item.id.toString(),
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
