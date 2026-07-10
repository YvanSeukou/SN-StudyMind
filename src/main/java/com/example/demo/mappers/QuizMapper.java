package com.example.demo.mappers;

import org.springframework.stereotype.Component;

import com.example.demo.dto.QuizDto;
import com.example.demo.enums.Difficulty;
import com.example.demo.models.Quiz;

@Component
public class QuizMapper {

    public Quiz toEntity(QuizDto dto) {
        Quiz quiz = new Quiz();

        quiz.setTitre(dto.getTitre());

        if (dto.getDifficulte() != null) {
            quiz.setDifficulte(Difficulty.valueOf(dto.getDifficulte().toUpperCase()));
        }

        return quiz;
    }

    public QuizDto toDto(Quiz quiz) {
        QuizDto dto = new QuizDto();

        dto.setIdQuiz(quiz.getIdQuiz());
        dto.setTitre(quiz.getTitre());

        if (quiz.getDifficulte() != null) {
            dto.setDifficulte(quiz.getDifficulte().name());
        }

        if (quiz.getCours() != null) {
            dto.setIdCours(quiz.getCours().getIdCours());
        }

        return dto;
    }
}