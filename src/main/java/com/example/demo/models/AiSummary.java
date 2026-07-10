package com.example.demo.models;

import java.time.LocalDateTime;

import com.example.demo.enums.SummaryType;
import com.fasterxml.jackson.annotation.JsonBackReference;

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
@Table(name = "resume_ia")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idResume;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String contenu;

    @Enumerated(EnumType.STRING)
    private SummaryType typeResume = SummaryType.RESUME_COURT;

    private LocalDateTime dateGeneration = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "id_document")
    @JsonBackReference
    private Document document;

	public LocalDateTime getDateGeneration() {
		return dateGeneration;
	}

	public void setDateGeneration(LocalDateTime dateGeneration) {
		this.dateGeneration = dateGeneration;
	}

	public Long getIdResume() {
		return idResume;
	}

	public void setIdResume(Long idResume) {
		this.idResume = idResume;
	}

	public String getContenu() {
		return contenu;
	}

	public void setContenu(String contenu) {
		this.contenu = contenu;
	}

	public SummaryType getTypeResume() {
		return typeResume;
	}

	public void setTypeResume(SummaryType typeResume) {
		this.typeResume = typeResume;
	}

	public Document getDocument() {
		return document;
	}

	public void setDocument(Document document) {
	    this.document = document;
	}
}