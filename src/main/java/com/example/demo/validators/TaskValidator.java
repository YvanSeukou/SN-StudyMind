package com.example.demo.validators;

import java.time.LocalDate;

import org.springframework.stereotype.Component;

import com.example.demo.dto.TaskDto;

@Component
public class TaskValidator {

    public void validateTask(TaskDto dto) {

        if (dto.getDateLimite() != null &&
                dto.getDateLimite().isBefore(LocalDate.now())) {

            throw new RuntimeException("La date limite ne peut pas être dans le passé");
        }

        if (dto.getPriorite() != null) {
            try {
                com.example.demo.enums.Priority.valueOf(dto.getPriorite());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Priorité invalide : FAIBLE, MOYENNE ou ELEVEE attendue");
            }
        }

        if (dto.getStatut() != null) {
            try {
                com.example.demo.enums.TaskStatus.valueOf(dto.getStatut());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Statut invalide : A_FAIRE, EN_COURS ou TERMINEE attendu");
            }
        }
    }
}