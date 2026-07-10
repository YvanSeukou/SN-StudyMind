package com.example.demo.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.Quiz;
import com.example.demo.models.QuizResult;
import com.example.demo.models.User;
import com.example.demo.repositories.QuizRepository;
import com.example.demo.repositories.QuizResultRepository;
import com.example.demo.repositories.UserRepository;

/**
 * Persistance des resultats de quiz.
 * Chaque passage d'un quiz par un etudiant est enregistre, ce qui permet
 * de calculer un vrai score moyen et un historique de progression.
 *
 * Accessible a tout utilisateur authentifie (regle anyRequest().authenticated()).
 */
@RestController
@RequestMapping("/api/quiz-results")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class QuizResultController {

    private final QuizResultRepository quizResultRepository;
    private final UserRepository userRepository;
    private final QuizRepository quizRepository;

    public QuizResultController(
            QuizResultRepository quizResultRepository,
            UserRepository userRepository,
            QuizRepository quizRepository) {

        this.quizResultRepository = quizResultRepository;
        this.userRepository = userRepository;
        this.quizRepository = quizRepository;
    }

    // DTO renvoye au front (evite d'exposer les entites directement).
    public record QuizResultDto(
            Long idResultat,
            Integer score,
            Integer total,
            Integer pourcentage,
            String datePassage,
            Long idQuiz,
            String titreQuiz,
            Long idUtilisateur) {
    }

    private QuizResultDto toDto(QuizResult r) {
        int pct = (r.getTotal() != null && r.getTotal() > 0)
                ? (int) Math.round(100.0 * r.getScore() / r.getTotal())
                : 0;
        return new QuizResultDto(
                r.getIdResultat(),
                r.getScore(),
                r.getTotal(),
                pct,
                r.getDatePassage() != null ? r.getDatePassage().toString() : null,
                r.getQuiz() != null ? r.getQuiz().getIdQuiz() : null,
                r.getQuiz() != null ? r.getQuiz().getTitre() : null,
                r.getUtilisateur() != null ? r.getUtilisateur().getIdUtilisateur() : null
        );
    }

    // POST /api/quiz-results/user/{idUtilisateur}/quiz/{idQuiz}?score=3&total=5
    @PostMapping("/user/{idUtilisateur}/quiz/{idQuiz}")
    public QuizResultDto saveResult(
            @PathVariable Long idUtilisateur,
            @PathVariable Long idQuiz,
            @RequestParam Integer score,
            @RequestParam Integer total) {

        User user = userRepository.findById(idUtilisateur)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Utilisateur introuvable : " + idUtilisateur));

        Quiz quiz = quizRepository.findById(idQuiz)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Quiz introuvable : " + idQuiz));

        QuizResult result = new QuizResult();
        result.setScore(score);
        result.setTotal(total);
        result.setUtilisateur(user);
        result.setQuiz(quiz);

        return toDto(quizResultRepository.save(result));
    }

    // GET /api/quiz-results/user/{idUtilisateur} -> historique (du plus recent)
    @GetMapping("/user/{idUtilisateur}")
    public List<QuizResultDto> getResultsByUser(@PathVariable Long idUtilisateur) {
        return quizResultRepository
                .findByUtilisateurIdUtilisateurOrderByDatePassageDesc(idUtilisateur)
                .stream()
                .map(this::toDto)
                .toList();
    }

    // GET /api/quiz-results/user/{idUtilisateur}/average -> { scoreMoyen, nombreQuiz }
    @GetMapping("/user/{idUtilisateur}/average")
    public Map<String, Object> getAverage(@PathVariable Long idUtilisateur) {

        List<QuizResult> results =
                quizResultRepository.findByUtilisateurIdUtilisateur(idUtilisateur);

        double moyenne = results.stream()
                .filter(r -> r.getTotal() != null && r.getTotal() > 0)
                .mapToDouble(r -> 100.0 * r.getScore() / r.getTotal())
                .average()
                .orElse(0.0);

        Map<String, Object> reponse = new HashMap<>();
        reponse.put("scoreMoyen", (int) Math.round(moyenne));
        reponse.put("nombreQuiz", results.size());
        return reponse;
    }
}