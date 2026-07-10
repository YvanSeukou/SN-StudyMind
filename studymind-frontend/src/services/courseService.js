import api from "../api/client";

// GET /api/courses/user/{idUtilisateur}
export async function getCoursesByUser(idUtilisateur) {
  const { data } = await api.get(`/courses/user/${idUtilisateur}`);
  return data;
}

// GET /api/courses/{id}
export async function getCourseById(id) {
  const { data } = await api.get(`/courses/${id}`);
  return data;
}

// POST /api/courses/user/{idUtilisateur}  body: { titre, description }
export async function createCourse(idUtilisateur, { titre, description }) {
  const { data } = await api.post(`/courses/user/${idUtilisateur}`, {
    titre,
    description,
  });
  return data;
}

// PUT /api/courses/{id}
export async function updateCourse(id, payload) {
  const { data } = await api.put(`/courses/${id}`, payload);
  return data;
}

// DELETE /api/courses/{id}
export async function deleteCourse(id) {
  await api.delete(`/courses/${id}`);
}
