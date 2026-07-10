package com.example.demo.controllers;

import java.io.IOException;
import java.util.List;

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

import com.example.demo.dto.AiSummaryDto;
import com.example.demo.enums.SummaryType;
import com.example.demo.mappers.AiSummaryMapper;
import com.example.demo.models.AiSummary;
import com.example.demo.services.AiSummaryService;
import com.example.demo.validators.AiSummaryValidator;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ai-summaries")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173"
})
public class AiSummaryController {

    private final AiSummaryService aiSummaryService;
    private final AiSummaryValidator aiSummaryValidator;
    private final AiSummaryMapper aiSummaryMapper;

    public AiSummaryController(
            AiSummaryService aiSummaryService,
            AiSummaryValidator aiSummaryValidator,
            AiSummaryMapper aiSummaryMapper) {

        this.aiSummaryService = aiSummaryService;
        this.aiSummaryValidator = aiSummaryValidator;
        this.aiSummaryMapper = aiSummaryMapper;
    }

    @GetMapping
    public List<AiSummary> getAllSummaries() {
        return aiSummaryService.getAllSummaries();
    }

    @GetMapping("/{id}")
    public AiSummary getSummaryById(@PathVariable Long id) {
        return aiSummaryService.getSummaryById(id);
    }

    @GetMapping("/document/{idDocument}")
    public List<AiSummary> getSummariesByDocument(
            @PathVariable Long idDocument) {

        return aiSummaryService.getSummariesByDocument(idDocument);
    }

    @PostMapping("/document/{idDocument}")
    public AiSummary createSummary(
            @PathVariable Long idDocument,
            @Valid @RequestBody AiSummaryDto dto) {

        aiSummaryValidator.validateSummary(dto);

        AiSummary aiSummary =
                aiSummaryMapper.toEntity(dto);

        return aiSummaryService.createSummary(
                idDocument,
                aiSummary
        );
    }

    @PutMapping("/{id}")
    public AiSummary updateSummary(
            @PathVariable Long id,
            @Valid @RequestBody AiSummaryDto dto) {

        aiSummaryValidator.validateSummary(dto);

        AiSummary aiSummary =
                aiSummaryMapper.toEntity(dto);

        return aiSummaryService.updateSummary(
                id,
                aiSummary
        );
    }
    
    @PostMapping("/generate/document/{idDocument}")
    public AiSummaryDto generateSummary(
            @PathVariable Long idDocument,
            @RequestParam(name = "type", required = false, defaultValue = "RESUME_COURT") SummaryType type)
            throws IOException {

        AiSummary summary =
                aiSummaryService.generateSummaryFromDocument(idDocument, type);

        return aiSummaryMapper.toDto(summary);
    }

    @DeleteMapping("/{id}")
    public void deleteSummary(@PathVariable Long id) {
        aiSummaryService.deleteSummary(id);
    }
}