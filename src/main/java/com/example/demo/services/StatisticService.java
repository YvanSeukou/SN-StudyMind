package com.example.demo.services;


import org.springframework.stereotype.Service;

import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.Statistic;
import com.example.demo.models.User;
import com.example.demo.repositories.StatisticRepository;
import com.example.demo.repositories.UserRepository;

@Service
public class StatisticService {

    private final StatisticRepository statisticRepository;
    private final UserRepository userRepository;

    public StatisticService(StatisticRepository statisticRepository, UserRepository userRepository) {
        this.statisticRepository = statisticRepository;
        this.userRepository = userRepository;
    }

    public Statistic getStatisticByUser(Long idUtilisateur) {
        return statisticRepository.findByUtilisateurIdUtilisateur(idUtilisateur)
                .orElseThrow(() -> new ResourceNotFoundException("Statistique introuvable pour l'utilisateur : " + idUtilisateur));
    }

    public Statistic createStatistic(Long idUtilisateur, Statistic statistic) {
        User user = userRepository.findById(idUtilisateur)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable avec l'id : " + idUtilisateur));

        statistic.setUtilisateur(user);
        return statisticRepository.save(statistic);
    }

    public Statistic updateStatistic(Long id, Statistic statisticDetails) {
        Statistic statistic = statisticRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Statistique introuvable avec l'id : " + id));

        statistic.setTempsEtude(statisticDetails.getTempsEtude());
        statistic.setScoreMoyen(statisticDetails.getScoreMoyen());
        statistic.setTachesTerminees(statisticDetails.getTachesTerminees());
        statistic.setProgressionGlobale(statisticDetails.getProgressionGlobale());

        return statisticRepository.save(statistic);
    }
}