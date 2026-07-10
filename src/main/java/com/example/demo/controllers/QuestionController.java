package com.example.demo.controllers;


import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.QuestionDto;
import com.example.demo.models.Question;
import com.example.demo.services.QuestionService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    @GetMapping("/{id}")
    public Question getQuestionById(@PathVariable Long id) {
        return questionService.getQuestionById(id);
    }

    @GetMapping("/quiz/{idQuiz}")
    public List<Question> getQuestionsByQuiz(@PathVariable Long idQuiz) {
        return questionService.getQuestionsByQuiz(idQuiz);
    }

    @PostMapping("/quiz/{idQuiz}")
    public Question createQuestion(
            @PathVariable Long idQuiz,
            @Valid @RequestBody QuestionDto dto) {

        Question question = new Question();
        question.setLibelle(dto.getLibelle());
        question.setBonneReponse(dto.getBonneReponse());

        return questionService.createQuestion(idQuiz, question);
    }

    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
    }
}