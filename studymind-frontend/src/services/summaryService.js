import api from "../api/client";

// Types de résumé disponibles (doivent correspondre à l'enum SummaryType du back)
export const TYPES_RESUME = [
  { value: "RESUME_COURT", label: "Résumé court" },
  { value: "EXPLICATION", label: "Explication détaillée" },
  { value: "FICHE_REVISION", label: "Fiche de révision" },
];

// GET /api/ai-summaries/document/{idDocument}
export async function getSummariesByDocument(idDocument) {
  const { data } = await api.get(`/ai-summaries/document/${idDocument}`);
  return data;
}

// POST /api/ai-summaries/generate/document/{idDocument}?type=...
export async function generateSummary(idDocument, type = "RESUME_COURT") {
  const { data } = await api.post(
    `/ai-summaries/generate/document/${idDocument}`,
    null,
    { params: { type } }
  );
  return data;
}

// DELETE /api/ai-summaries/{id}
export async function deleteSummary(id) {
  await api.delete(`/ai-summaries/${id}`);
}
