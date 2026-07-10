package com.example.demo.services;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.example.demo.enums.SummaryType;

@Service
public class AiGenerationService {

    private final ChatClient chatClient;

    public AiGenerationService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String generateSummary(String content, SummaryType type) {

        String consigne = switch (type) {
            case RESUME_COURT -> "Fais un résumé court et synthétique, en quelques phrases, qui va à l'essentiel.";
            case EXPLICATION -> "Explique le contenu en détail, comme à un étudiant qui découvre le sujet, avec des exemples concrets si utile.";
            case FICHE_REVISION -> "Produis une fiche de révision structurée : titres, points clés sous forme de liste, et définitions importantes à retenir.";
        };

        String prompt = """
                Tu es un assistant pédagogique.
                %s
                Réponds en français, de manière claire et utile pour un étudiant.
                N'invente aucune information absente du document.

                Document :
                %s
                """.formatted(consigne, content);

        return chatClient
                .prompt(prompt)
                .call()
                .content();
    }

    public String generateQuiz(String content, com.example.demo.enums.Difficulty difficulte) {

        com.example.demo.enums.Difficulty niveau =
                (difficulte != null) ? difficulte : com.example.demo.enums.Difficulty.MOYEN;

        String consigne = switch (niveau) {
            case FACILE -> "Pose des questions SIMPLES sur les definitions et les faits de base.";
            case MOYEN -> "Pose des questions de niveau MOYEN qui demandent de comprendre les notions.";
            case DIFFICILE -> "Pose des questions DIFFICILES qui demandent d'analyser, comparer ou appliquer les notions.";
        };

        String prompt = """
                Tu es un generateur de quiz pedagogique.
                A partir du document ci-dessous, cree EXACTEMENT 5 questions a choix multiple en francais.
                Niveau : %s. %s

                REGLES ABSOLUES (a respecter sans exception) :
                - Exactement 5 questions, numerotees de 1 a 5.
                - Chaque question possede EXACTEMENT 4 options : A, B, C et D.
                - Chaque option contient un VRAI texte de reponse, jamais juste une lettre.
                - Une seule bonne reponse par question, indiquee par sa LETTRE (A, B, C ou D).
                - Les 5 questions doivent etre DIFFERENTES les unes des autres, aucune repetition.
                - Utilise uniquement les informations presentes dans le document, n'invente rien.

                FORMAT EXACT a respecter (aucun markdown, aucun texte avant ou apres) :

                Question 1: <texte de la question>
                A: <texte de la reponse A>
                B: <texte de la reponse B>
                C: <texte de la reponse C>
                D: <texte de la reponse D>
                Bonne reponse: <A, B, C ou D>

                Question 2: <texte de la question>
                A: ...
                B: ...
                C: ...
                D: ...
                Bonne reponse: ...

                (continue ainsi jusqu'a la Question 5)

                Document :
                %s
                """.formatted(niveau.name(), consigne, content);

        return chatClient
                .prompt(prompt)
                .call()
                .content();
    }
}