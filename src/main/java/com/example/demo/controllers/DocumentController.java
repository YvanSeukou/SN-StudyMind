package com.example.demo.controllers;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.DocumentDto;
import com.example.demo.mappers.DocumentMapper;
import com.example.demo.models.Document;
import com.example.demo.services.DocumentReaderService;
import com.example.demo.services.DocumentService;
import com.example.demo.services.FileStorageService;
import com.example.demo.validators.DocumentValidator;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173"
})
public class DocumentController {

    private final DocumentService documentService;
    private final DocumentValidator documentValidator;
    private final DocumentMapper documentMapper;
    private final FileStorageService fileStorageService;
    private final DocumentReaderService documentReaderService;

    public DocumentController(
            DocumentService documentService,
            DocumentValidator documentValidator,
            DocumentMapper documentMapper,
            FileStorageService fileStorageService,
            DocumentReaderService documentReaderService) {

        this.documentService = documentService;
        this.documentValidator = documentValidator;
        this.documentMapper = documentMapper;
        this.fileStorageService = fileStorageService;
        this.documentReaderService = documentReaderService;
    }

    @GetMapping
    public List<DocumentDto> getAllDocuments() {
        return documentService.getAllDocuments()
                .stream()
                .map(documentMapper::toDto)
                .toList();
    }
    
    @GetMapping("/{id}/content")
    public String getDocumentContent(@PathVariable Long id) throws IOException {
        return documentReaderService.extractTextFromDocument(id);
    }

    @GetMapping("/{id}")
    public DocumentDto getDocumentById(@PathVariable Long id) {
        Document document = documentService.getDocumentById(id);
        return documentMapper.toDto(document);
    }

    @GetMapping("/course/{idCours}")
    public List<DocumentDto> getDocumentsByCourse(@PathVariable Long idCours) {
        return documentService.getDocumentsByCourse(idCours)
                .stream()
                .map(documentMapper::toDto)
                .toList();
    }

    @PostMapping("/course/{idCours}")
    public DocumentDto createDocument(
            @PathVariable Long idCours,
            @Valid @RequestBody DocumentDto dto) {

        documentValidator.validateDocument(dto);

        Document document = documentMapper.toEntity(dto);
        Document savedDocument = documentService.createDocument(idCours, document);

        return documentMapper.toDto(savedDocument);
    }

    @PostMapping(
            value = "/upload/{idCours}",
            consumes = "multipart/form-data"
    )
    public DocumentDto uploadDocument(
            @PathVariable Long idCours,
            @RequestParam("file") MultipartFile file)
            throws IOException {

        documentValidator.validateUpload(file);

        String filePath = fileStorageService.storeFile(file);

        Document document = new Document();
        document.setNomFichier(file.getOriginalFilename());
        document.setTypeFichier(file.getContentType());
        document.setCheminFichier(filePath);

        Document savedDocument = documentService.createDocument(idCours, document);

        return documentMapper.toDto(savedDocument);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id)
            throws IOException {

        Document document = documentService.getDocumentById(id);

        Path filePath = Paths.get(document.getCheminFichier());
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            throw new RuntimeException("Fichier introuvable");
        }

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + document.getNomFichier() + "\""
                )
                .body(resource);
    }

    @PutMapping("/{id}")
    public DocumentDto updateDocument(
            @PathVariable Long id,
            @Valid @RequestBody DocumentDto dto) {

        documentValidator.validateDocument(dto);

        Document document = documentMapper.toEntity(dto);
        Document updatedDocument = documentService.updateDocument(id, document);

        return documentMapper.toDto(updatedDocument);
    }

    @DeleteMapping("/{id}")
    public void deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
    }
}