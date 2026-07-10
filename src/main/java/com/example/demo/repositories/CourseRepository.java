package com.example.demo.repositories;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByUtilisateurIdUtilisateur(Long idUtilisateur);
}