import api from "../api/client";

// GET /api/documents/course/{idCours}
export async function getDocumentsByCourse(idCours) {
  const { data } = await api.get(`/documents/course/${idCours}`);
  return data;
}

// GET /api/documents/{id}
export async function getDocumentById(id) {
  const { data } = await api.get(`/documents/${id}`);
  return data;
}

// GET /api/documents/{id}/content  -> texte extrait du fichier
export async function getDocumentContent(id) {
  const { data } = await api.get(`/documents/${id}/content`);
  return data;
}

// POST /api/documents/upload/{idCours}  (multipart, champ "file")
export async function uploadDocument(idCours, file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post(`/documents/upload/${idCours}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// GET /api/documents/download/{id}
// On telecharge via axios (qui ajoute le token JWT), puis on declenche
// l'enregistrement du fichier cote navigateur. Un simple <a href> ne
// fonctionne PAS ici car il n'envoie pas le token -> erreur 403.
export async function downloadDocument(id, nomFichier) {
  const response = await api.get(`/documents/download/${id}`, {
    responseType: "blob",
  });
  const url = URL.createObjectURL(response.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomFichier || `document-${id}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// DELETE /api/documents/{id}
export async function deleteDocument(id) {
  await api.delete(`/documents/${id}`);
}
