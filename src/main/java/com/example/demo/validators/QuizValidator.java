package com.example.demo.validators;

import org.springframework.stereotype.Component;

import com.example.demo.dto.QuizDto;
import com.example.demo.enums.Difficulty;

@Component
public class QuizValidator {

    public void validateQuiz(QuizDto dto) {

        if (dto.getDifficulte() != null) {
            try {
                Difficulty.valueOf(dto.getDifficulte());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Difficulté invalide : FACILE, MOYEN ou DIFFICILE attendu");
            }
        }
    }
}