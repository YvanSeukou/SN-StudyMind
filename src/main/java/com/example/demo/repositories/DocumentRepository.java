package com.example.demo.repositories;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Document;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByCoursIdCours(Long idCours);
}