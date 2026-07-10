package com.example.demo.mappers;

import org.springframework.stereotype.Component;

import com.example.demo.dto.DocumentDto;
import com.example.demo.models.Document;

@Component
public class DocumentMapper {

    public Document toEntity(DocumentDto dto) {
        Document document = new Document();

        document.setNomFichier(dto.getNomFichier());
        document.setTypeFichier(dto.getTypeFichier());
        document.setCheminFichier(dto.getCheminFichier());

        return document;
    }

    public DocumentDto toDto(Document document) {
        DocumentDto dto = new DocumentDto();

        dto.setIdDocument(document.getIdDocument());
        dto.setNomFichier(document.getNomFichier());
        dto.setTypeFichier(document.getTypeFichier());
        dto.setCheminFichier(document.getCheminFichier());

        if (document.getCours() != null) {
            dto.setIdCours(document.getCours().getIdCours());
        }

        return dto;
    }
}