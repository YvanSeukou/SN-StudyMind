package com.example.demo.mappers;

import java.util.List;

import org.springframework.stereotype.Component;

import com.example.demo.dto.UserDto;
import com.example.demo.enums.Role;
import com.example.demo.models.User;

@Component
public class UserMapper {

    public User toEntity(UserDto dto) {

        User user = new User();

        user.setNom(dto.getNom());
        user.setPrenom(dto.getPrenom());
        user.setEmail(dto.getEmail());
        user.setMotDePasse(dto.getMotDePasse());

        if (dto.getRole() != null) {
            user.setRole(Role.valueOf(dto.getRole().toUpperCase()));
        }

        return user;
    }

    public UserDto toDto(User user) {

        UserDto dto = new UserDto();

        dto.setIdUtilisateur(user.getIdUtilisateur());
        dto.setNom(user.getNom());
        dto.setPrenom(user.getPrenom());
        dto.setEmail(user.getEmail());

        if (user.getRole() != null) {
            dto.setRole(user.getRole().name());
        }

        return dto;
    }

    public List<UserDto> toDtoList(List<User> users) {

        return users.stream()
                .map(this::toDto)
                .toList();
    }
}