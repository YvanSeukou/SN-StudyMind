package com.example.demo.validators;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.DocumentDto;

@Component
public class DocumentValidator {

    public void validateDocument(DocumentDto dto) {

        String type = dto.getTypeFichier();

        if (type == null) {
            throw new RuntimeException("Le type de fichier est obligatoire");
        }

        if (!type.equalsIgnoreCase("PDF")
                && !type.equalsIgnoreCase("DOCX")
                && !type.equalsIgnoreCase("TXT")) {

            throw new RuntimeException("Type de fichier non autorisé. Types acceptés : PDF, DOCX, TXT");
        }
    }
    
    public void validateUpload(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Le fichier est obligatoire");
        }

        long maxSize = 20 * 1024 * 1024;

        if (file.getSize() > maxSize) {
            throw new RuntimeException("Le fichier dépasse 20MB");
        }

        String contentType = file.getContentType();

        if (!"application/pdf".equals(contentType)
                && !"application/vnd.openxmlformats-officedocument.wordprocessingml.document".equals(contentType)
                && !"text/plain".equals(contentType)) {

            throw new RuntimeException(
                    "Type non autorisé. Formats acceptés : PDF, DOCX, TXT"
            );
        }
    }
    
    
}