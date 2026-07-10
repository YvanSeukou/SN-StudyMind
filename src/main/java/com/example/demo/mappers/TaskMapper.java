package com.example.demo.mappers;

import org.springframework.stereotype.Component;

import com.example.demo.dto.TaskDto;
import com.example.demo.enums.Priority;
import com.example.demo.enums.TaskStatus;
import com.example.demo.models.Course;
import com.example.demo.models.Task;

@Component
public class TaskMapper {

    public Task toEntity(TaskDto dto) {
        Task task = new Task();

        task.setTitre(dto.getTitre());
        task.setDescription(dto.getDescription());
        task.setDateLimite(dto.getDateLimite());

        if (dto.getPriorite() != null) {
            task.setPriorite(Priority.valueOf(dto.getPriorite().toUpperCase()));
        }

        if (dto.getStatut() != null) {
            task.setStatut(TaskStatus.valueOf(dto.getStatut().toUpperCase()));
        }

        if (dto.getIdCours() != null) {
            Course course = new Course();
            course.setIdCours(dto.getIdCours());
            task.setCours(course);
        }

        return task;
    }

    public TaskDto toDto(Task task) {
        TaskDto dto = new TaskDto();

        dto.setIdTache(task.getIdTache());
        dto.setTitre(task.getTitre());
        dto.setDescription(task.getDescription());
        dto.setDateLimite(task.getDateLimite());

        if (task.getPriorite() != null) {
            dto.setPriorite(task.getPriorite().name());
        }

        if (task.getStatut() != null) {
            dto.setStatut(task.getStatut().name());
        }

        if (task.getCours() != null) {
            dto.setIdCours(task.getCours().getIdCours());
        }

        if (task.getUtilisateur() != null) {
            dto.setIdUtilisateur(task.getUtilisateur().getIdUtilisateur());
        }

        return dto;
    }
}