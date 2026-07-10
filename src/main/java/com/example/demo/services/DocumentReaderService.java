package com.example.demo.services;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;

import com.example.demo.models.Document;

@Service
public class DocumentReaderService {

    private final DocumentService documentService;

    public DocumentReaderService(DocumentService documentService) {
        this.documentService = documentService;
    }

    public String extractTextFromDocument(Long idDocument) throws IOException {

        Document document = documentService.getDocumentById(idDocument);

        File file = new File(document.getCheminFichier());

        if (!file.exists()) {
            throw new RuntimeException(
                    "Fichier introuvable : " + document.getCheminFichier()
            );
        }

        String type = document.getTypeFichier();
        String fileName = document.getNomFichier().toLowerCase();

        if ("application/pdf".equals(type)
                || fileName.endsWith(".pdf")) {

            return readPdf(file);
        }

        if ("application/vnd.openxmlformats-officedocument.wordprocessingml.document".equals(type)
                || fileName.endsWith(".docx")) {

            return readDocx(file);
        }

        if ("text/plain".equals(type)
                || fileName.endsWith(".txt")) {

            return readTxt(file);
        }

        throw new RuntimeException(
                "Type de fichier non supporté : " + type
        );
    }

    private String readPdf(File file) throws IOException {

        try (PDDocument pdf = Loader.loadPDF(file)) {

            PDFTextStripper stripper = new PDFTextStripper();

            return stripper.getText(pdf);
        }
    }

    private String readDocx(File file) throws IOException {

        StringBuilder content = new StringBuilder();

        try (
                FileInputStream fis = new FileInputStream(file);
                XWPFDocument document = new XWPFDocument(fis)
        ) {
            document.getParagraphs().forEach(paragraph -> {
                content.append(paragraph.getText()).append("\n");
            });
        }

        return content.toString();
    }

    private String readTxt(File file) throws IOException {

        return Files.readString(file.toPath());
    }
}