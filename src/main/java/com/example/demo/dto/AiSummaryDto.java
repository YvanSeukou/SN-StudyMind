package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@NoArgsConstructor
@AllArgsConstructor
@Data
public class AiSummaryDto {
	  private Long idResume;

	    @NotBlank(message = "Le contenu est obligatoire")
	    private String contenu;

	    @NotBlank(message = "Le type de résumé est obligatoire")
	    private String typeResume;

	    private Long idDocument;
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
	public String getTypeResume() {
		return typeResume;
	}
	public void setTypeResume(String typeResume) {
		this.typeResume = typeResume;
	}
	public Long getIdDocument() {
		return idDocument;
	}
	public void setIdDocument(Long idDocument) {
		this.idDocument = idDocument;
	}
}