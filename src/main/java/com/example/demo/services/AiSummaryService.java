package com.example.demo.services;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.enums.SummaryType;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.AiSummary;
import com.example.demo.models.Document;
import com.example.demo.repositories.AiSummaryRepository;
import com.example.demo.repositories.DocumentRepository;

@Service
public class AiSummaryService {

    private final AiSummaryRepository aiSummaryRepository;
    private final DocumentRepository documentRepository;
    private final DocumentReaderService documentReaderService;
    private final AiGenerationService aiGenerationService;

    public AiSummaryService(
            AiSummaryRepository aiSummaryRepository,
            DocumentRepository documentRepository,
            DocumentReaderService documentReaderService,
            AiGenerationService aiGenerationService) {

        this.aiSummaryRepository = aiSummaryRepository;
        this.documentRepository = documentRepository;
        this.documentReaderService = documentReaderService;
        this.aiGenerationService = aiGenerationService;
    }

    public List<AiSummary> getAllSummaries() {
        return aiSummaryRepository.findAll();
    }

    public List<AiSummary> getSummariesByDocument(Long idDocument) {
        return aiSummaryRepository.findByDocumentIdDocument(idDocument);
    }

    public AiSummary getSummaryById(Long id) {
        return aiSummaryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Résumé IA introuvable avec l'id : " + id
                        )
                );
    }

    public AiSummary createSummary(Long idDocument, AiSummary aiSummary) {

        Document document = documentRepository.findById(idDocument)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Document introuvable avec l'id : " + idDocument
                        )
                );

        aiSummary.setDocument(document);

        return aiSummaryRepository.save(aiSummary);
    }

    // Version sans type : garde l'ancien comportement (résumé court par défaut).
    public AiSummary generateSummaryFromDocument(Long idDocument)
            throws IOException {

        return generateSummaryFromDocument(idDocument, SummaryType.RESUME_COURT);
    }

    // Nouvelle version : on choisit le type de résumé.
    public AiSummary generateSummaryFromDocument(Long idDocument, SummaryType type)
            throws IOException {

        Document document = documentRepository.findById(idDocument)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Document introuvable avec l'id : " + idDocument
                        )
                );

        String content =
                documentReaderService.extractTextFromDocument(idDocument);

        String limitedContent;

        if (content.length() > 6000) {

            limitedContent =
                    content.substring(0, 6000);

        } else {

            limitedContent = content;
        }

        // Sécurité : si aucun type fourni, on retombe sur le résumé court.
        SummaryType typeResume =
                (type != null) ? type : SummaryType.RESUME_COURT;

        String summary =
                aiGenerationService.generateSummary(
                        limitedContent,
                        typeResume
                );

        AiSummary aiSummary = new AiSummary();

        aiSummary.setContenu(summary);
        aiSummary.setTypeResume(typeResume);
        aiSummary.setDocument(document);

        return aiSummaryRepository.save(aiSummary);
    }

    public AiSummary updateSummary(Long id, AiSummary updatedSummary) {

        AiSummary existingSummary = aiSummaryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Résumé IA introuvable avec l'id : " + id
                        )
                );

        existingSummary.setContenu(updatedSummary.getContenu());
        existingSummary.setTypeResume(updatedSummary.getTypeResume());

        return aiSummaryRepository.save(existingSummary);
    }

    public void deleteSummary(Long id) {

        AiSummary aiSummary = getSummaryById(id);

        aiSummaryRepository.delete(aiSummary);
    }
}