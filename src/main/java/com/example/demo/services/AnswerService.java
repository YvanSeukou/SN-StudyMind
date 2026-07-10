package com.example.demo.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.Answer;
import com.example.demo.models.Question;
import com.example.demo.repositories.AnswerRepository;
import com.example.demo.repositories.QuestionRepository;

@Service
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;

    public AnswerService(AnswerRepository answerRepository, QuestionRepository questionRepository) {
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
    }

    public List<Answer> getAllAnswers() {
        return answerRepository.findAll();
    }

    public List<Answer> getAnswersByQuestion(Long idQuestion) {
        return answerRepository.findByQuestionIdQuestion(idQuestion);
    }

    public Answer getAnswerById(Long id) {
        return answerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Réponse introuvable avec l'id : " + id));
    }

    public Answer createAnswer(Long idQuestion, Answer answer) {
        Question question = questionRepository.findById(idQuestion)
                .orElseThrow(() -> new ResourceNotFoundException("Question introuvable avec l'id : " + idQuestion));

        answer.setQuestion(question);
        return answerRepository.save(answer);
    }

    public void deleteAnswer(Long id) {
        Answer answer = getAnswerById(id);
        answerRepository.delete(answer);
    }
}