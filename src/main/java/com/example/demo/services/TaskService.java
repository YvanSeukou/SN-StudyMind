package com.example.demo.services;



import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.Course;
import com.example.demo.models.Task;
import com.example.demo.models.User;
import com.example.demo.repositories.CourseRepository;
import com.example.demo.repositories.TaskRepository;
import com.example.demo.repositories.UserRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository, CourseRepository courseRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByUser(Long idUtilisateur) {
        return taskRepository.findByUtilisateurIdUtilisateur(idUtilisateur);
    }

    public List<Task> getTasksByCourse(Long idCours) {
        return taskRepository.findByCoursIdCours(idCours);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tâche introuvable avec l'id : " + id));
    }

    public Task createTask(Long idUtilisateur, Task task) {
        User user = userRepository.findById(idUtilisateur)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable avec l'id : " + idUtilisateur));

        task.setUtilisateur(user);

        if (task.getCours() != null && task.getCours().getIdCours() != null) {
            Course course = courseRepository.findById(task.getCours().getIdCours())
                    .orElseThrow(() -> new ResourceNotFoundException("Cours introuvable avec l'id : " + task.getCours().getIdCours()));
            task.setCours(course);
        }

        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task task = getTaskById(id);

        task.setTitre(taskDetails.getTitre());
        task.setDescription(taskDetails.getDescription());
        task.setDateLimite(taskDetails.getDateLimite());
        task.setPriorite(taskDetails.getPriorite());
        task.setStatut(taskDetails.getStatut());

        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = getTaskById(id);
        taskRepository.delete(task);
    }
}