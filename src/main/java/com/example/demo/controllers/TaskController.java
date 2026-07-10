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

import com.example.demo.dto.TaskDto;
import com.example.demo.enums.Priority;
import com.example.demo.enums.TaskStatus;
import com.example.demo.mappers.TaskMapper;
import com.example.demo.models.Course;
import com.example.demo.models.Task;
import com.example.demo.services.TaskService;
import com.example.demo.validators.TaskValidator;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TaskController {

    private final TaskService taskService;
    private final TaskValidator taskValidator;
    private final TaskMapper taskMapper;

    public TaskController(TaskService taskService, TaskValidator taskValidator, TaskMapper taskMapper) {
        this.taskService = taskService;
        this.taskValidator = taskValidator;
        this.taskMapper = taskMapper;
    }

    @GetMapping
    public List<TaskDto> getAllTasks() {
        return taskService.getAllTasks()
                .stream()
                .map(taskMapper::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public TaskDto getTaskById(@PathVariable Long id) {
        return taskMapper.toDto(taskService.getTaskById(id));
    }

    @GetMapping("/user/{idUtilisateur}")
    public List<TaskDto> getTasksByUser(@PathVariable Long idUtilisateur) {
        return taskService.getTasksByUser(idUtilisateur)
                .stream()
                .map(taskMapper::toDto)
                .toList();
    }

    @GetMapping("/course/{idCours}")
    public List<TaskDto> getTasksByCourse(@PathVariable Long idCours) {
        return taskService.getTasksByCourse(idCours)
                .stream()
                .map(taskMapper::toDto)
                .toList();
    }

    @PostMapping("/user/{idUtilisateur}")
    public TaskDto createTask(@PathVariable Long idUtilisateur, @Valid @RequestBody TaskDto dto) {
        taskValidator.validateTask(dto);

        Task task = taskMapper.toEntity(dto);

        if (dto.getIdCours() != null) {
            Course course = new Course();
            course.setIdCours(dto.getIdCours());
            task.setCours(course);
        }

        return taskMapper.toDto(taskService.createTask(idUtilisateur, task));
    }

    @PutMapping("/{id}")
    public TaskDto updateTask(@PathVariable Long id, @Valid @RequestBody TaskDto dto) {
        taskValidator.validateTask(dto);

        Task task = new Task();
        task.setTitre(dto.getTitre());
        task.setDescription(dto.getDescription());
        task.setDateLimite(dto.getDateLimite());
        task.setPriorite(Priority.valueOf(dto.getPriorite().toUpperCase()));
        task.setStatut(TaskStatus.valueOf(dto.getStatut().toUpperCase()));

        return taskMapper.toDto(taskService.updateTask(id, task));
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}