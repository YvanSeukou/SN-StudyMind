package com.example.demo.models;

import java.time.LocalDate;

import com.example.demo.enums.Priority;
import com.example.demo.enums.TaskStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tache")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTache;

    @Column(nullable = false)
    private String titre;
    

    private String description;

    private LocalDate dateLimite;

    @Enumerated(EnumType.STRING)
    private Priority priorite = Priority.MOYENNE;

    @Enumerated(EnumType.STRING)
    private TaskStatus statut = TaskStatus.A_FAIRE;

    @ManyToOne
    @JoinColumn(name = "id_cours")
    private Course cours;	

    @ManyToOne
    @JoinColumn(name = "id_utilisateur")
    private User utilisateur;

	public Long getIdTache() {
		return idTache;
	}

	public void setIdTache(Long idTache) {
		this.idTache = idTache;
	}

	public String getTitre() {
		return titre;
	}

	public void setTitre(String titre) {
		this.titre = titre;
	}

	public Priority getPriorite() {
		return priorite;
	}

	public void setPriorite(Priority priorite) {
		this.priorite = priorite;
	}

	public TaskStatus getStatut() {
		return statut;
	}

	public void setStatut(TaskStatus statut) {
		this.statut = statut;
	}

	public Course getCours() {
		return cours;
	}

	public void setCours(Course cours) {
		this.cours = cours;
	}

	public User getUtilisateur() {
		return utilisateur;
	}

	public void setUtilisateur(User utilisateur) {
		this.utilisateur = utilisateur;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public LocalDate getDateLimite() {
		return dateLimite;
	}

	public void setDateLimite(LocalDate dateLimite) {
		this.dateLimite = dateLimite;
	}

	
}