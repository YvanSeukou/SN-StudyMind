package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AnswerDto {
    private Long idReponse;
    @NotBlank(message = "Le contenu est obligatoire")
    private String contenu;
    private Boolean estCorrecte;
    private Long idQuestion;
	public Long getIdReponse() {
		return idReponse;
	}
	public void setIdReponse(Long idReponse) {
		this.idReponse = idReponse;
	}
	public String getContenu() {
		return contenu;
	}
	public void setContenu(String contenu) {
		this.contenu = contenu;
	}
	public Boolean getEstCorrecte() {
		return estCorrecte;
	}
	public void setEstCorrecte(Boolean estCorrecte) {
		this.estCorrecte = estCorrecte;
	}
	public Long getIdQuestion() {
		return idQuestion;
	}
	public void setIdQuestion(Long idQuestion) {
		this.idQuestion = idQuestion;
	}
}