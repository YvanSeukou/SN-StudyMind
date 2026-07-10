package com.example.demo.validators;

import org.springframework.stereotype.Component;

import com.example.demo.dto.StatisticDto;

@Component
public class StatisticValidator {

    public void validateStatistic(StatisticDto dto) {

        if (dto.getTempsEtude() != null && dto.getTempsEtude() < 0) {
            throw new RuntimeException("Le temps d'étude ne peut pas être négatif");
        }

        if (dto.getScoreMoyen() != null &&
                (dto.getScoreMoyen() < 0 || dto.getScoreMoyen() > 100)) {

            throw new RuntimeException("Le score moyen doit être compris entre 0 et 100");
        }

        if (dto.getProgressionGlobale() != null &&
                (dto.getProgressionGlobale() < 0 || dto.getProgressionGlobale() > 100)) {

            throw new RuntimeException("La progression globale doit être comprise entre 0 et 100");
        }

        if (dto.getTachesTerminees() != null && dto.getTachesTerminees() < 0) {
            throw new RuntimeException("Le nombre de tâches terminées ne peut pas être négatif");
        }
    }
}