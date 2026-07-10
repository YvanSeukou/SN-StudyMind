package com.example.demo.mappers;

import org.springframework.stereotype.Component;

import com.example.demo.dto.CourseDto;
import com.example.demo.models.Course;

@Component
public class CourseMapper {

    public Course toEntity(CourseDto dto) {
        Course course = new Course();

        course.setTitre(dto.getTitre());
        course.setDescription(dto.getDescription());

        return course;
    }

    public CourseDto toDto(Course course) {
        CourseDto dto = new CourseDto();

        dto.setIdCours(course.getIdCours());
        dto.setTitre(course.getTitre());
        dto.setDescription(course.getDescription());

        if (course.getUtilisateur() != null) {
            dto.setIdUtilisateur(course.getUtilisateur().getIdUtilisateur());
        }

        return dto;
    }
}