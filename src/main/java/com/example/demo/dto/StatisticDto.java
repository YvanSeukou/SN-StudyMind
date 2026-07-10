package com.example.demo.dto;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class StatisticDto {
    private Long idStatistique;
    @PositiveOrZero(message = "Le temps d'étude doit être positif")
    private Integer tempsEtude;

    @PositiveOrZero(message = "Le score moyen doit être positif")
    private Double scoreMoyen;

    @PositiveOrZero(message = "Le nombre de tâches terminées doit être positif")
    private Integer tachesTerminees;

    @PositiveOrZero(message = "La progression doit être positive")
    private Double progressionGlobale;
    private Long idUtilisateur;
	public Long getIdStatistique() {
		return idStatistique;
	}
	public void setIdStatistique(Long idStatistique) {
		this.idStatistique = idStatistique;
	}
	public Integer getTempsEtude() {
		return tempsEtude;
	}
	public void setTempsEtude(Integer tempsEtude) {
		this.tempsEtude = tempsEtude;
	}
	public Double getScoreMoyen() {
		return scoreMoyen;
	}
	public void setScoreMoyen(Double scoreMoyen) {
		this.scoreMoyen = scoreMoyen;
	}
	public Integer getTachesTerminees() {
		return tachesTerminees;
	}
	public void setTachesTerminees(Integer tachesTerminees) {
		this.tachesTerminees = tachesTerminees;
	}
	public Double getProgressionGlobale() {
		return progressionGlobale;
	}
	public void setProgressionGlobale(Double progressionGlobale) {
		this.progressionGlobale = progressionGlobale;
	}
	public Long getIdUtilisateur() {
		return idUtilisateur;
	}
	public void setIdUtilisateur(Long idUtilisateur) {
		this.idUtilisateur = idUtilisateur;
	}
}