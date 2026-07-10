package com.example.demo.models;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
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
@Table(name = "quiz_result")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idResultat;

    // Nombre de bonnes reponses.
    private Integer score;

    // Nombre total de questions.
    private Integer total;

    private LocalDateTime datePassage = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "id_utilisateur")
    private User utilisateur;

    public Long getIdResultat() {
		return idResultat;
	}

	public void setIdResultat(Long idResultat) {
		this.idResultat = idResultat;
	}

	public Integer getScore() {
		return score;
	}

	public void setScore(Integer score) {
		this.score = score;
	}

	public Integer getTotal() {
		return total;
	}

	public void setTotal(Integer total) {
		this.total = total;
	}

	public LocalDateTime getDatePassage() {
		return datePassage;
	}

	public void setDatePassage(LocalDateTime datePassage) {
		this.datePassage = datePassage;
	}

	public User getUtilisateur() {
		return utilisateur;
	}

	public void setUtilisateur(User utilisateur) {
		this.utilisateur = utilisateur;
	}

	public Quiz getQuiz() {
		return quiz;
	}

	public void setQuiz(Quiz quiz) {
		this.quiz = quiz;
	}

	@ManyToOne
    @JoinColumn(name = "id_quiz")
    private Quiz quiz;
}