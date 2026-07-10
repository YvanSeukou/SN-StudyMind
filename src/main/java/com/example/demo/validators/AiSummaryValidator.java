package com.example.demo.validators;

import org.springframework.stereotype.Component;

import com.example.demo.dto.AiSummaryDto;
import com.example.demo.enums.SummaryType;

@Component
public class AiSummaryValidator {

    public void validateSummary(AiSummaryDto dto) {

        if (dto.getTypeResume() != null) {
            try {
                SummaryType.valueOf(dto.getTypeResume());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Type de résumé invalide : RESUME, EXPLICATION ou FICHE_REVISION attendu");
            }
        }
    }
}