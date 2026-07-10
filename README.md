# 🚀 Déploiement SN StudyMind avec Docker

## Architecture

```
┌─────────────┐     ┌─────────────────┐     ┌─────────┐
│  Frontend   │────▶│    Backend      │────▶│  MySQL  │
│ React/Nginx │     │  Spring Boot    │     │  :3306  │
│   :80       │     │    :8080        │     └─────────┘
└─────────────┘     └─────────────────┘
                            │
                     ┌──────────────┐
                     │    Ollama    │
                     │ llama3.2:3b  │
                     │   :11434     │
                     └──────────────┘
```

## Prérequis

- Docker Desktop installé → https://www.docker.com/products/docker-desktop
- Git (optionnel)

## Structure des fichiers à placer

```
votre-projet/
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── nginx.conf
├── .env                   ← créer depuis .env.example
├── pom.xml
├── src/
│   └── main/...
└── frontend/
    ├── package.json
    └── src/...
```

## Étapes de déploiement

### 1. Préparer l'environnement

```bash
cp .env.example .env
# Éditez .env si vous voulez changer les mots de passe
```

### 2. Lancer tous les services

```bash
docker compose up --build -d
```

> ⏳ Le premier lancement prend 5-10 minutes (téléchargement des images + build Maven)

### 3. Télécharger le modèle Ollama

```bash
docker exec studymind-ollama ollama pull llama3.2:3b
```

> ⏳ Cette étape peut prendre quelques minutes selon votre connexion (~2GB)

### 4. Accéder à l'application

- **Frontend** → http://localhost
- **Backend API** → http://localhost:8080/api
- **Swagger UI** → http://localhost:8080/swagger-ui.html

---

## Commandes utiles

```bash
# Voir les logs en temps réel
docker compose logs -f

# Voir les logs d'un seul service
docker compose logs -f backend

# Redémarrer un service
docker compose restart backend

# Arrêter tout
docker compose down

# Arrêter ET supprimer les données (reset complet)
docker compose down -v
```

## Mise à jour de l'application

```bash
# Rebuilder et relancer
docker compose up --build -d
```

## Problèmes courants

| Problème | Solution |
|---|---|
| Backend ne démarre pas | Vérifiez que MySQL est healthy : `docker compose logs mysql` |
| Ollama ne répond pas | Attendez 30s après le démarrage, puis `docker compose logs ollama` |
| Port 80 déjà utilisé | Changez `"80:80"` en `"3000:80"` dans docker-compose.yml |
| Upload de fichiers échoue | Le volume `uploads_data` est persistant, vérifiez les permissions |
