package com.example.demo.mappers;

import org.springframework.stereotype.Component;

import com.example.demo.dto.StatisticDto;
import com.example.demo.models.Statistic;

@Component
public class StatisticMapper {

    public Statistic toEntity(StatisticDto dto) {
        Statistic statistic = new Statistic();

        statistic.setTempsEtude(dto.getTempsEtude());
        statistic.setScoreMoyen(dto.getScoreMoyen());
        statistic.setTachesTerminees(dto.getTachesTerminees());
        statistic.setProgressionGlobale(dto.getProgressionGlobale());

        return statistic;
    }

    public StatisticDto toDto(Statistic statistic) {
        StatisticDto dto = new StatisticDto();

        dto.setIdStatistique(statistic.getIdStatistique());
        dto.setTempsEtude(statistic.getTempsEtude());
        dto.setScoreMoyen(statistic.getScoreMoyen());
        dto.setTachesTerminees(statistic.getTachesTerminees());
        dto.setProgressionGlobale(statistic.getProgressionGlobale());

        if (statistic.getUtilisateur() != null) {
            dto.setIdUtilisateur(statistic.getUtilisateur().getIdUtilisateur());
        }

        return dto;
    }
}