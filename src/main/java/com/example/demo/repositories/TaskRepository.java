package com.example.demo.repositories;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUtilisateurIdUtilisateur(Long idUtilisateur);

    List<Task> findByCoursIdCours(Long idCours);
}