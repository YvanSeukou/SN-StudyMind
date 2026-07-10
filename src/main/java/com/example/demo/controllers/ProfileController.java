package com.example.demo.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.UserDto;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.mappers.UserMapper;
import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;

/**
 * Gestion du profil de l'utilisateur CONNECTE.
 * L'utilisateur est identifie par l'email contenu dans son token JWT,
 * jamais par un id fourni dans l'URL : un etudiant ne peut donc modifier
 * que SON propre profil, pas celui d'un autre.
 *
 * Accessible a tout utilisateur authentifie (regle anyRequest().authenticated()
 * du SecurityConfig), donc aussi bien ADMIN qu'ETUDIANT.
 */
@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ProfileController {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public ProfileController(
            UserRepository userRepository,
            UserMapper userMapper,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    // Recupere l'utilisateur courant a partir de l'email du token.
    private User currentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Utilisateur introuvable : " + email
                        )
                );
    }

    // GET /api/profile -> infos du profil courant (sans le mot de passe).
    @GetMapping
    public UserDto getMyProfile(Authentication authentication) {
        return userMapper.toDto(currentUser(authentication));
    }

    // PUT /api/profile -> modifie nom, prenom et (si fourni) le mot de passe.
    @PutMapping
    public UserDto updateMyProfile(
            Authentication authentication,
            @RequestBody UserDto dto) {

        User user = currentUser(authentication);

        if (dto.getNom() != null) {
            user.setNom(dto.getNom());
        }
        if (dto.getPrenom() != null) {
            user.setPrenom(dto.getPrenom());
        }

        // Nouveau mot de passe uniquement s'il est fourni et non vide.
        if (dto.getMotDePasse() != null && !dto.getMotDePasse().isBlank()) {
            user.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));
        }

        // On ne touche NI au role NI a l'email : l'email est la cle du token,
        // le modifier ici invaliderait la session en cours.
        return userMapper.toDto(userRepository.save(user));
    }
}