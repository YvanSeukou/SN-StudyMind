package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

	 @NotBlank(message = "L'email est obligatoire")
	    @Email(message = "Email invalide")
	    private String email;

	    @NotBlank(message = "Le mot de passe est obligatoire")
	    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
	    private String motDePasse;

	public String getMotDePasse() {
		return motDePasse;
	}

	public void setMotDePasse(String motDePasse) {
		this.motDePasse = motDePasse;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
}
