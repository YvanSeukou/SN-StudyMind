package com.example.demo.repositories;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Question;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByQuizIdQuiz(Long idQuiz);
}