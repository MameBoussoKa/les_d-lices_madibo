# 🎨 Déploiement sur Render (Alternative)

## Étapes de déploiement

### 1. Préparer le repo GitHub
Assure-toi que ton code est sur GitHub (même étapes que Railway)

### 2. Créer la base PostgreSQL
1. Sur Render, clique "New +" → "PostgreSQL"
2. Configure :
   - **Name** : madibo-delices-db
   - **Plan** : Free
3. Note l'URL de connexion générée

### 3. Déployer sur Render  
1. Clique "New +" → "Web Service"
2. Connecte ton repo GitHub
3. Configure :
   - **Name** : les-delices-de-madibo
   - **Environment** : Node
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Plan** : Free

### 4. Variables d'environnement
- `NODE_ENV` = `production`
- `DATABASE_URL` = `postgresql://...` (copie l'URL de ta base créée à l'étape 2)

### 5. Déploiement
- Clique sur "Create Web Service"
- Attendre 2-3 minutes
- Ton app sera sur : `https://les-delices-de-madibo.onrender.com`

## ⚠️ Limitations Render Free
- L'app "dort" après 15 min d'inactivité
- Premier chargement lent après inactivité
- 750h/mois maximum

## 💡 Astuce
Pour éviter le "sleep", utilise un service comme UptimeRobot pour ping ton app toutes les 10 minutes.
