# 🚂 Déploiement sur Railway

## Étapes de déploiement

### 1. Préparer le code
```bash
# Vérifier que tout fonctionne localement
npm start

# Arrêter le serveur local
Ctrl+C
```

### 2. Initialiser Git (si pas déjà fait)
```bash
git init
git add .
git commit -m "Initial commit - Les Délices de Madibo"
```

### 3. Créer un repo GitHub
1. Va sur GitHub.com
2. Crée un nouveau repository "les-delices-de-madibo"
3. Connecte ton repo local :

```bash
git remote add origin https://github.com/TON-USERNAME/les-delices-de-madibo.git
git branch -M main
git push -u origin main
```

### 4. Déployer sur Railway
1. Va sur https://railway.app
2. Clique sur "Start a New Project"
3. Sélectionne "Deploy from GitHub repo"
4. Connecte ton compte GitHub
5. Sélectionne ton repo "les-delices-de-madibo"
6. Railway détectera automatiquement Node.js
7. Le déploiement se lance automatiquement !

### 5. Variables d'environnement (optionnel)
Dans Railway dashboard :
- Ajoute `NODE_ENV=production`
- Ajoute `PORT=3000` (optionnel)

### 6. Custom Domain (optionnel)
- Dans Railway, va dans Settings > Domains
- Génère un domain gratuit `.railway.app`
- Ou connecte ton propre domaine

## ✅ Résultat
Ton app sera accessible sur : `https://ton-app.railway.app`

## 🔄 Auto-Deploy
Chaque fois que tu push sur GitHub, Railway redéploie automatiquement !

```bash
# Pour mettre à jour
git add .
git commit -m "Mise à jour"
git push
```
