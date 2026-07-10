package com.example.demo.models;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "document")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDocument;

    @Column(nullable = false)
    private String nomFichier;

    private String typeFichier;

    @Column(nullable = false)
    private String cheminFichier;

    private LocalDateTime dateUpload = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "id_cours")
    @JsonBackReference
    private Course cours;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<AiSummary> resumes;

	public String getTypeFichier() {
		return typeFichier;
	}

	public void setTypeFichier(String typeFichier) {
		this.typeFichier = typeFichier;
	}

	public LocalDateTime getDateUpload() {
		return dateUpload;
	}

	public void setDateUpload(LocalDateTime dateUpload) {
		this.dateUpload = dateUpload;
	}

	public Long getIdDocument() {
		return idDocument;
	}

	public void setIdDocument(Long idDocument) {
		this.idDocument = idDocument;
	}

	public String getNomFichier() {
		return nomFichier;
	}

	public void setNomFichier(String nomFichier) {
		this.nomFichier = nomFichier;
	}

	public String getCheminFichier() {
		return cheminFichier;
	}

	public void setCheminFichier(String cheminFichier) {
		this.cheminFichier = cheminFichier;
	}

	public List<AiSummary> getResumes() {
		return resumes;
	}

	public void setResumes(List<AiSummary> resumes) {
		this.resumes = resumes;
	}

	public Course getCours() {
		return cours;
	}

	public void setCours(Course cours) {
		this.cours = cours;
	}
}
	