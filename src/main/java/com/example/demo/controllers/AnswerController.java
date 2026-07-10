package com.example.demo.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AnswerDto;
import com.example.demo.models.Answer;
import com.example.demo.services.AnswerService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/answers")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AnswerController {

    private final AnswerService answerService;

    public AnswerController(AnswerService answerService) {
        this.answerService = answerService;
    }

    @GetMapping
    public List<Answer> getAllAnswers() {
        return answerService.getAllAnswers();
    }

    @GetMapping("/{id}")
    public Answer getAnswerById(@PathVariable Long id) {
        return answerService.getAnswerById(id);
    }

    @GetMapping("/question/{idQuestion}")
    public List<Answer> getAnswersByQuestion(@PathVariable Long idQuestion) {
        return answerService.getAnswersByQuestion(idQuestion);
    }

    @PostMapping("/question/{idQuestion}")
    public Answer createAnswer(
            @PathVariable Long idQuestion,
            @Valid @RequestBody AnswerDto dto) {

        Answer answer = new Answer();
        answer.setContenu(dto.getContenu());
        answer.setEstCorrecte(dto.getEstCorrecte());

        return answerService.createAnswer(idQuestion, answer);
    }

    @DeleteMapping("/{id}")
    public void deleteAnswer(@PathVariable Long id) {
        answerService.deleteAnswer(id);
    }
}