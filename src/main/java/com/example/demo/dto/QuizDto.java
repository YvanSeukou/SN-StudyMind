package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QuizDto {
	 private Long idQuiz;

	    @NotBlank(message = "Le titre du quiz est obligatoire")
	    private String titre;

	    @NotBlank(message = "La difficulté est obligatoire")
	    private String difficulte;

	    private Long idCours;
	    
	public Long getIdQuiz() {
		return idQuiz;
	}
	public void setIdQuiz(Long idQuiz) {
		this.idQuiz = idQuiz;
	}
	public String getTitre() {
		return titre;
	}
	public void setTitre(String titre) {
		this.titre = titre;
	}
	public String getDifficulte() {
		return difficulte;
	}
	public void setDifficulte(String difficulte) {
		this.difficulte = difficulte;
	}
	public Long getIdCours() {
		return idCours;
	}
	public void setIdCours(Long idCours) {
		this.idCours = idCours;
	}
}