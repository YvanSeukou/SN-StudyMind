# StudyMind — Frontend

Frontend React (Vite + Tailwind) connecté au backend Spring Boot de StudyMind.

## Pile technique

- React 18 + React Router 6
- Vite (serveur de dev + build)
- Tailwind CSS v4
- Axios (appels API + JWT)

---

## Pas-à-pas : connecter le front au back

### 1. Lancer le backend

Dans Eclipse, démarre l'application Spring Boot `SnStudyMindApplication`.
Vérifie qu'elle tourne bien sur **http://localhost:8080**.

Assure-toi aussi que :

- **MySQL** est démarré (base `sn_studymind`).
- **Ollama** est lancé et que le modèle est téléchargé :
  ```
  ollama pull llama3.2:3b
  ollama serve
  ```
  (sinon les fonctions « résumé » et « quiz » échoueront)

### 2. Installer le frontend

Ouvre un terminal dans ce dossier (`studymind-frontend`) et lance :

```
npm install
```

### 3. Vérifier l'URL de l'API

Le fichier `.env` contient :

```
VITE_API_URL=http://localhost:8080/api
```

Change-le seulement si ton backend tourne sur un autre port.

### 4. Lancer le frontend

```
npm run dev
```

Le site s'ouvre sur **http://localhost:5173**.

### 5. Tester

1. Va sur http://localhost:5173 → tu arrives sur la page de connexion.
2. Clique sur « Créer un compte » et inscris-toi.
3. Tu es redirigé vers le tableau de bord.
4. Crée un cours → ouvre-le → ajoute un document → génère un résumé / un quiz.

---

## Important : CORS

Ton backend autorise déjà les origines `http://localhost:5173` et
`http://localhost:3000` (annotations `@CrossOrigin` + `CorsConfig`).
Comme Vite tourne sur **5173**, tout fonctionne sans rien changer.

Si tu changes le port du front, ajoute la nouvelle origine côté backend
(dans `CorsConfig` et/ou les `@CrossOrigin`).

---

## Comment c'est branché sur tes endpoints

| Écran             | Endpoint backend                                   |
| ----------------- | -------------------------------------------------- |
| Inscription       | `POST /api/auth/register`                          |
| Connexion         | `POST /api/auth/login`                             |
| Liste des cours   | `GET /api/courses/user/{idUtilisateur}`            |
| Créer un cours    | `POST /api/courses/user/{idUtilisateur}`           |
| Documents d'un cours | `GET /api/documents/course/{idCours}`           |
| Upload document   | `POST /api/documents/upload/{idCours}` (multipart) |
| Résumé IA         | `POST /api/ai-summaries/generate/document/{id}`    |
| Générer un quiz   | `POST /api/quizzes/generate-save/document/{id}`    |
| Tâches            | `GET /api/tasks/user/{idUtilisateur}`              |

Le token JWT renvoyé à la connexion est stocké dans le navigateur et
ajouté automatiquement à chaque requête (en-tête `Authorization: Bearer ...`).
L'`idUtilisateur` renvoyé à la connexion sert à scoper les appels.

---

## Structure du projet

```
src/
  api/client.js            -> instance axios + intercepteurs JWT
  context/AuthContext.jsx  -> état de connexion (token, idUtilisateur)
  services/                -> 1 fichier par ressource (cours, docs, quiz...)
  components/              -> Sidebar, Navbar, Layout, cartes, route protégée
  pages/                   -> 1 fichier par écran
```
