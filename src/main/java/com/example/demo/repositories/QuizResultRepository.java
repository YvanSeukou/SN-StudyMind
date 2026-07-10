package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.QuizResult;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {

    List<QuizResult> findByUtilisateurIdUtilisateur(Long idUtilisateur);

    List<QuizResult> findByUtilisateurIdUtilisateurOrderByDatePassageDesc(Long idUtilisateur);
}