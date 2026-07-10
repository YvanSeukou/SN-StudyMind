package com.example.demo.repositories;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.AiSummary;

public interface AiSummaryRepository extends JpaRepository<AiSummary, Long> {

    List<AiSummary> findByDocumentIdDocument(Long idDocument);
}