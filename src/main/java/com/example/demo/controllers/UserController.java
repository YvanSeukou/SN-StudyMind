package com.example.demo.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.UserDto;
import com.example.demo.mappers.UserMapper;
import com.example.demo.models.User;
import com.example.demo.services.UserService;
import com.example.demo.validators.UserValidator;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173"
})
public class UserController {

    private final UserService userService;
    private final UserValidator userValidator;
    private final UserMapper userMapper;

    public UserController(
            UserService userService,
            UserValidator userValidator,
            UserMapper userMapper) {

        this.userService = userService;
        this.userValidator = userValidator;
        this.userMapper = userMapper;
    }

    @GetMapping
    public List<UserDto> getAllUsers() {

        List<User> users = userService.getAllUsers();

        return userMapper.toDtoList(users);
    }

    @GetMapping("/{id}")
    public UserDto getUserById(@PathVariable Long id) {

        User user = userService.getUserById(id);

        return userMapper.toDto(user);
    }

    @PostMapping
    public UserDto createUser(
            @Valid @RequestBody UserDto dto) {

        userValidator.validateCreateUser(dto);

        User user = userMapper.toEntity(dto);

        User savedUser = userService.createUser(user);

        return userMapper.toDto(savedUser);
    }

    // Pas de @Valid ici : le mot de passe est OPTIONNEL a la mise a jour
    // (le UserDto l'impose sinon). L'admin peut modifier nom/prenom/email/role
    // sans avoir a re-saisir un mot de passe.
    @PutMapping("/{id}")
    public UserDto updateUser(
            @PathVariable Long id,
            @RequestBody UserDto dto) {

        User user = userMapper.toEntity(dto);

        User updatedUser = userService.updateUser(id, user);

        return userMapper.toDto(updatedUser);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}