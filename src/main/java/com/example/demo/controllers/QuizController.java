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

import com.example.demo.dto.QuizDto;
import com.example.demo.mappers.QuizMapper;
import com.example.demo.models.Quiz;
import com.example.demo.services.QuizService;
import com.example.demo.validators.QuizValidator;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173"
})
public class QuizController {

    private final QuizService quizService;
    private final QuizValidator quizValidator;
    private final QuizMapper quizMapper;

    public QuizController(
            QuizService quizService,
            QuizValidator quizValidator,
            QuizMapper quizMapper) {

        this.quizService = quizService;
        this.quizValidator = quizValidator;
        this.quizMapper = quizMapper;
    }

    @GetMapping
    public List<Quiz> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    @GetMapping("/{id}")
    public Quiz getQuizById(@PathVariable Long id) {
        return quizService.getQuizById(id);
    }

    @GetMapping("/course/{idCours}")
    public List<Quiz> getQuizzesByCourse(
            @PathVariable Long idCours) {

        return quizService.getQuizzesByCourse(idCours);
    }

    @PostMapping("/course/{idCours}")
    public Quiz createQuiz(
            @PathVariable Long idCours,
            @Valid @RequestBody QuizDto dto) {

        quizValidator.validateQuiz(dto);

        Quiz quiz = quizMapper.toEntity(dto);

        return quizService.createQuiz(idCours, quiz);
    }
    
    @PostMapping("/generate/document/{idDocument}")
    public String generateQuizFromDocument(
            @PathVariable Long idDocument)
            throws IOException {

        return quizService.generateQuizFromDocument(
                idDocument
        );
    }
    
    @PostMapping("/generate-save/document/{idDocument}")
    public Quiz generateAndSaveQuiz(
            @PathVariable Long idDocument,
            @RequestParam(name = "difficulte", required = false, defaultValue = "MOYEN")
                    com.example.demo.enums.Difficulty difficulte)
            throws IOException {

        return quizService.generateAndSaveQuiz(
                idDocument,
                difficulte
        );
    }

    @PutMapping("/{id}")
    public Quiz updateQuiz(
            @PathVariable Long id,
            @Valid @RequestBody QuizDto dto) {

        quizValidator.validateQuiz(dto);

        Quiz quiz = quizMapper.toEntity(dto);

        return quizService.updateQuiz(id, quiz);
    }

    @DeleteMapping("/{id}")
    public void deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
    }
}