package com.example.demo.services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.enums.Difficulty;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.models.Answer;
import com.example.demo.models.Course;
import com.example.demo.models.Document;
import com.example.demo.models.Question;
import com.example.demo.models.Quiz;
import com.example.demo.repositories.AnswerRepository;
import com.example.demo.repositories.CourseRepository;
import com.example.demo.repositories.DocumentRepository;
import com.example.demo.repositories.QuestionRepository;
import com.example.demo.repositories.QuizRepository;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;
    private final DocumentReaderService documentReaderService;
    private final AiGenerationService aiGenerationService;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final DocumentRepository documentRepository;

    public QuizService(
            QuizRepository quizRepository,
            CourseRepository courseRepository,
            DocumentReaderService documentReaderService,
            AiGenerationService aiGenerationService,
            QuestionRepository questionRepository,
            AnswerRepository answerRepository,
            DocumentRepository documentRepository) {

        this.quizRepository = quizRepository;
        this.courseRepository = courseRepository;
        this.documentReaderService = documentReaderService;
        this.aiGenerationService = aiGenerationService;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.documentRepository = documentRepository;
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public List<Quiz> getQuizzesByCourse(Long idCours) {
        return quizRepository.findByCoursIdCours(idCours);
    }

    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Quiz introuvable avec l'id : " + id)
                );
    }

    public Quiz createQuiz(Long idCours, Quiz quiz) {

        Course course = courseRepository.findById(idCours)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cours introuvable avec l'id : " + idCours)
                );

        quiz.setCours(course);

        return quizRepository.save(quiz);
    }

    public Quiz generateAndSaveQuiz(Long idDocument) throws IOException {
        return generateAndSaveQuiz(idDocument, Difficulty.MOYEN);
    }

    public Quiz generateAndSaveQuiz(Long idDocument, Difficulty difficulte) throws IOException {

        Document document = documentRepository.findById(idDocument)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Document introuvable avec l'id : " + idDocument)
                );

        Difficulty niveau = (difficulte != null) ? difficulte : Difficulty.MOYEN;

        String aiResponse = generateQuizFromDocument(idDocument, niveau);

        Quiz quiz = new Quiz();
        quiz.setTitre("Quiz IA (" + niveau.name() + ") - " + document.getNomFichier());
        quiz.setDifficulte(niveau);
        quiz.setCours(document.getCours());

        Quiz savedQuiz = quizRepository.save(quiz);

        String[] blocks = aiResponse.split("(?i)Question\\s*\\d*\\s*[:.)-]?");

        List<Question> questions = new ArrayList<>();
        List<String> libellesVus = new ArrayList<>();

        // Motifs de detection (tolerants aux formats renvoyes par le modele)
        java.util.regex.Pattern motifBonneReponse = java.util.regex.Pattern
                .compile("(?i)^bonne\\s*r[e\u00e9]ponse\\s*[:.)\\-]?\\s*(.+)$");
        java.util.regex.Pattern motifOption = java.util.regex.Pattern
                .compile("^\\(?([A-Da-d])\\)?\\s*[:.)\\-]\\s*(.+)$");
        java.util.regex.Pattern motifLettre = java.util.regex.Pattern
                .compile("^\\(?([A-Da-d])\\)?");

        for (String block : blocks) {

            if (block.isBlank()) {
                continue;
            }

            String[] lines = block.split("\\r?\\n");

            String libelle = null;
            List<String> optionsLettre = new ArrayList<>();
            List<String> optionsTexte = new ArrayList<>();
            String bonneReponseBrute = null;

            for (String raw : lines) {

                String line = raw.trim();

                if (line.isBlank()) {
                    continue;
                }

                java.util.regex.Matcher mRep = motifBonneReponse.matcher(line);
                if (mRep.find()) {
                    bonneReponseBrute = mRep.group(1).trim();
                    continue;
                }

                java.util.regex.Matcher mOpt = motifOption.matcher(line);
                if (mOpt.find()) {
                    optionsLettre.add(mOpt.group(1).toUpperCase());
                    optionsTexte.add(mOpt.group(2).trim());
                    continue;
                }

                if (libelle == null) {
                    libelle = line;
                }
            }

            // VALIDATION : on ecarte les questions mal formees.
            if (libelle == null || libelle.isBlank()) {
                continue;
            }
            if (optionsTexte.size() < 2) {
                continue;
            }
            if (bonneReponseBrute == null || bonneReponseBrute.isBlank()) {
                continue;
            }

            // DEDOUBLONNAGE : on saute une question deja vue.
            String cle = libelle.toLowerCase().replaceAll("[^a-z0-9]", "");
            if (libellesVus.contains(cle)) {
                continue;
            }
            libellesVus.add(cle);

            // Determination de l'option correcte.
            int indexCorrect = -1;
            java.util.regex.Matcher mLettre = motifLettre.matcher(bonneReponseBrute);
            if (mLettre.find()) {
                String lettre = mLettre.group(1).toUpperCase();
                int idx = optionsLettre.indexOf(lettre);
                if (idx != -1) {
                    indexCorrect = idx;
                }
            }
            if (indexCorrect == -1) {
                for (int i = 0; i < optionsTexte.size(); i++) {
                    if (optionsTexte.get(i).equalsIgnoreCase(bonneReponseBrute)) {
                        indexCorrect = i;
                        break;
                    }
                }
            }

            Question question = new Question();
            question.setLibelle(libelle);
            question.setBonneReponse(bonneReponseBrute);
            question.setQuiz(savedQuiz);

            Question savedQuestion = questionRepository.save(question);

            for (int i = 0; i < optionsTexte.size(); i++) {
                Answer answer = new Answer();
                answer.setContenu(optionsTexte.get(i));
                answer.setEstCorrecte(i == indexCorrect);
                answer.setQuestion(savedQuestion);
                answerRepository.save(answer);
            }

            questions.add(savedQuestion);

            // On s'arrete a 5 questions valides.
            if (questions.size() >= 5) {
                break;
            }
        }

        savedQuiz.setQuestions(questions);

        return quizRepository.save(savedQuiz);
    }

    public String generateQuizFromDocument(Long idDocument) throws IOException {
        return generateQuizFromDocument(idDocument, Difficulty.MOYEN);
    }

    public String generateQuizFromDocument(Long idDocument, Difficulty difficulte) throws IOException {

        String content = documentReaderService.extractTextFromDocument(idDocument);

        String limitedContent =
                content.length() > 6000
                        ? content.substring(0, 6000)
                        : content;

        Difficulty niveau = (difficulte != null) ? difficulte : Difficulty.MOYEN;

        return aiGenerationService.generateQuiz(limitedContent, niveau);
    }

    public Quiz updateQuiz(Long id, Quiz quizDetails) {

        Quiz quiz = getQuizById(id);

        quiz.setTitre(quizDetails.getTitre());
        quiz.setDifficulte(quizDetails.getDifficulte());

        return quizRepository.save(quiz);
    }

    public void deleteQuiz(Long id) {

        Quiz quiz = getQuizById(id);

        quizRepository.delete(quiz);
    }
}