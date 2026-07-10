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

import com.example.demo.dto.CourseDto;
import com.example.demo.mappers.CourseMapper;
import com.example.demo.models.Course;
import com.example.demo.services.CourseService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173"
})
public class CourseController {

    private final CourseService courseService;
    private final CourseMapper courseMapper;

    public CourseController(
            CourseService courseService,
            CourseMapper courseMapper) {

        this.courseService = courseService;
        this.courseMapper = courseMapper;
    }

    @GetMapping
    public List<CourseDto> getAllCourses() {

        List<Course> courses =
                courseService.getAllCourses();

        return courses.stream()
                .map(courseMapper::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public CourseDto getCourseById(
            @PathVariable Long id) {

        Course course =
                courseService.getCourseById(id);

        return courseMapper.toDto(course);
    }

    @GetMapping("/user/{idUtilisateur}")
    public List<CourseDto> getCoursesByUser(
            @PathVariable Long idUtilisateur) {

        List<Course> courses =
                courseService.getCoursesByUser(idUtilisateur);

        return courses.stream()
                .map(courseMapper::toDto)
                .toList();
    }

    @PostMapping("/user/{idUtilisateur}")
    public CourseDto createCourse(
            @PathVariable Long idUtilisateur,
            @Valid @RequestBody CourseDto dto) {

        Course course =
                courseMapper.toEntity(dto);

        Course savedCourse =
                courseService.createCourse(
                        idUtilisateur,
                        course
                );

        return courseMapper.toDto(savedCourse);
    }

    @PutMapping("/{id}")
    public CourseDto updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseDto dto) {

        Course course =
                courseMapper.toEntity(dto);

        Course updatedCourse =
                courseService.updateCourse(
                        id,
                        course
                );

        return courseMapper.toDto(updatedCourse);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }
}