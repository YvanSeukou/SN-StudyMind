package com.example.demo.models;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "cours")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCours;

    @Column(nullable = false)
    private String titre;

    private String description;

    private LocalDateTime dateCreation = LocalDateTime.now();

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "id_utilisateur")
    private User utilisateur;
    
  
    @JsonManagedReference
    @OneToMany(mappedBy = "cours", cascade = CascadeType.ALL)
    private List<Document> documents;

    @OneToMany(mappedBy = "cours", cascade = CascadeType.ALL)
    private List<Task> taches;

    @OneToMany(mappedBy = "cours", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Quiz> quizzes;

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public LocalDateTime getDateCreation() {
		return dateCreation;
	}

	public void setDateCreation(LocalDateTime dateCreation) {
		this.dateCreation = dateCreation;
	}

	public void setUtilisateur(User utilisateur) {
	    this.utilisateur = utilisateur;
	}

	public String getTitre() {
		// TODO Auto-generated method stub
		return titre;
	}

	public Long getIdCours() {
		return idCours;
	}

	public void setIdCours(Long idCours) {
		this.idCours = idCours;
	}

	public List<Document> getDocuments() {
		return documents;
	}

	public void setDocuments(List<Document> documents) {
		this.documents = documents;
	}

	public List<Task> getTaches() {
		return taches;
	}

	public void setTaches(List<Task> taches) {
		this.taches = taches;
	}

	public List<Quiz> getQuizzes() {
		return quizzes;
	}

	public void setQuizzes(List<Quiz> quizzes) {
		this.quizzes = quizzes;
	}

	public User getUtilisateur() {
		return utilisateur;
	}

	public void setTitre(String titre) {
	    this.titre = titre;
	}
}