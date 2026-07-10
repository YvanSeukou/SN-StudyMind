package com.example.demo.mappers;

import org.springframework.stereotype.Component;

import com.example.demo.dto.AiSummaryDto;
import com.example.demo.enums.SummaryType;
import com.example.demo.models.AiSummary;

@Component
public class AiSummaryMapper {

    public AiSummary toEntity(AiSummaryDto dto) {
        AiSummary summary = new AiSummary();

        summary.setContenu(dto.getContenu());

        if (dto.getTypeResume() != null) {
            summary.setTypeResume(SummaryType.valueOf(dto.getTypeResume().toUpperCase()));
        }

        return summary;
    }

    public AiSummaryDto toDto(AiSummary summary) {
        AiSummaryDto dto = new AiSummaryDto();

        dto.setIdResume(summary.getIdResume());
        dto.setContenu(summary.getContenu());

        if (summary.getTypeResume() != null) {
            dto.setTypeResume(summary.getTypeResume().name());
        }

        if (summary.getDocument() != null) {
            dto.setIdDocument(summary.getDocument().getIdDocument());
        }

        return dto;
    }
}