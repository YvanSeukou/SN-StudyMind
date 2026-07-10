package com.example.demo.services;



import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.Course;
import com.example.demo.models.Document;
import com.example.demo.repositories.CourseRepository;
import com.example.demo.repositories.DocumentRepository;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final CourseRepository courseRepository;

    public DocumentService(DocumentRepository documentRepository, CourseRepository courseRepository) {
        this.documentRepository = documentRepository;
        this.courseRepository = courseRepository;
    }
    
    public Document updateDocument(Long id, Document updatedDocument) {

        Document existingDocument = documentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Document introuvable"));

        existingDocument.setNomFichier(updatedDocument.getNomFichier());
        existingDocument.setTypeFichier(updatedDocument.getTypeFichier());
        existingDocument.setCheminFichier(updatedDocument.getCheminFichier());

        return documentRepository.save(existingDocument);
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public List<Document> getDocumentsByCourse(Long idCours) {
        return documentRepository.findByCoursIdCours(idCours);
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document introuvable avec l'id : " + id));
    }

    public Document createDocument(Long idCours, Document document) {
        Course course = courseRepository.findById(idCours)
                .orElseThrow(() -> new ResourceNotFoundException("Cours introuvable avec l'id : " + idCours));

        document.setCours(course);
        return documentRepository.save(document);
    }

    public void deleteDocument(Long id) {
        Document document = getDocumentById(id);
        documentRepository.delete(document);
    }
}