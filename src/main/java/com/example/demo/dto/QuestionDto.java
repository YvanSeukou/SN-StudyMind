package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QuestionDto {
	 private Long idQuestion;

	    @NotBlank(message = "Le libellé est obligatoire")
	    private String libelle;

	    @NotBlank(message = "La bonne réponse est obligatoire")
	    private String bonneReponse;

	    private Long idQuiz;
	public Long getIdQuestion() {
		return idQuestion;
	}
	public void setIdQuestion(Long idQuestion) {
		this.idQuestion = idQuestion;
	}
	public String getLibelle() {
		return libelle;
	}
	public void setLibelle(String libelle) {
		this.libelle = libelle;
	}
	public String getBonneReponse() {
		return bonneReponse;
	}
	public void setBonneReponse(String bonneReponse) {
		this.bonneReponse = bonneReponse;
	}
	public Long getIdQuiz() {
		return idQuiz;
	}
	public void setIdQuiz(Long idQuiz) {
		this.idQuiz = idQuiz;
	}
}