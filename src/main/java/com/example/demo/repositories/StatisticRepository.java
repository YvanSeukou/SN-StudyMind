package com.example.demo.repositories;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Statistic;

public interface StatisticRepository extends JpaRepository<Statistic, Long> {

    Optional<Statistic> findByUtilisateurIdUtilisateur(Long idUtilisateur);
}