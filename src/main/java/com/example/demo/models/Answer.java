package com.example.demo.models;


import jakarta.persistence.Column;
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
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "reponse")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReponse;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contenu;

    private Boolean estCorrecte = false;

    @ManyToOne
    @JoinColumn(name = "id_question")
    @JsonIgnore
    private Question question;

	public Boolean getEstCorrecte() {
		return estCorrecte;
	}

	public void setEstCorrecte(Boolean estCorrecte) {
		this.estCorrecte = estCorrecte;
	}

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

	public Question getQuestion() {
		return question;
	}

	public void setQuestion(Question question) {
	    this.question = question;
	}
}
