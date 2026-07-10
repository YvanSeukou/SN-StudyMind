package com.example.demo.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "statistique")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Statistic {	

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idStatistique;

    private Integer tempsEtude = 0;

    private Double scoreMoyen = 0.0;

    private Integer tachesTerminees = 0;

    private Double progressionGlobale = 0.0;

    @OneToOne
    @JoinColumn(name = "id_utilisateur", unique = true)
    private User utilisateur;

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

	public Long getIdStatistique() {
		return idStatistique;
	}

	public void setIdStatistique(Long idStatistique) {
		this.idStatistique = idStatistique;
	}

	public User getUtilisateur() {
		return utilisateur;
	}

	public void setUtilisateur(User utilisateur) {
		this.utilisateur = utilisateur;
	}

	public void setProgressionGlobale(Double progressionGlobale) {
		this.progressionGlobale = progressionGlobale;
	}
}