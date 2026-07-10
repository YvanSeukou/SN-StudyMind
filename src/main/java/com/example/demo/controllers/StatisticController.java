package com.example.demo.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.StatisticDto;
import com.example.demo.mappers.StatisticMapper;
import com.example.demo.models.Statistic;
import com.example.demo.services.StatisticService;
import com.example.demo.validators.StatisticValidator;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173"
})
public class StatisticController {

    private final StatisticService statisticService;
    private final StatisticValidator statisticValidator;
    private final StatisticMapper statisticMapper;

    public StatisticController(
            StatisticService statisticService,
            StatisticValidator statisticValidator,
            StatisticMapper statisticMapper) {

        this.statisticService = statisticService;
        this.statisticValidator = statisticValidator;
        this.statisticMapper = statisticMapper;
    }

    @GetMapping("/user/{idUtilisateur}")
    public Statistic getStatisticByUser(
            @PathVariable Long idUtilisateur) {

        return statisticService.getStatisticByUser(idUtilisateur);
    }

    @PostMapping("/user/{idUtilisateur}")
    public Statistic createStatistic(
            @PathVariable Long idUtilisateur,
            @Valid @RequestBody StatisticDto dto) {

        statisticValidator.validateStatistic(dto);

        Statistic statistic =
                statisticMapper.toEntity(dto);

        return statisticService.createStatistic(
                idUtilisateur,
                statistic
        );
    }

    @PutMapping("/{id}")
    public Statistic updateStatistic(
            @PathVariable Long id,
            @Valid @RequestBody StatisticDto dto) {

        statisticValidator.validateStatistic(dto);

        Statistic statistic =
                statisticMapper.toEntity(dto);

        return statisticService.updateStatistic(
                id,
                statistic
        );
    }
}