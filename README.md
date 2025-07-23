# 🍴 Les Délices de Madibo

Application web moderne de commande de collations pour étudiants, développée avec Node.js et Express.

## ✨ Fonctionnalités

- **Interface moderne** avec navigation par onglets
- **Gestion des produits** : Beignets, Croquettes, Pop-cornes
- **Commandes avec quantités** et calcul automatique du total
- **Suivi des commandes** en temps réel avec statuts
- **Interface admin** pour la gestion des commandes
- **Statistiques** de ventes complètes
- **Design responsive** compatible mobile
- **Animations fluides** et interface intuitive

## 🚀 Installation

```bash
# Cloner le projet
git clone <votre-repo>
cd les-delices-de-madibo

# Installer les dépendances
npm install

# Lancer l'application
npm start
```

## 📱 Utilisation

- **Interface Client** : http://localhost:3000
- **Interface Admin** : http://localhost:3000/admin

### Pour les clients :
1. Entrez votre nom
2. Sélectionnez vos produits avec les quantités
3. Confirmez votre commande
4. Suivez le statut dans l'onglet "En cours"

### Pour les administrateurs :
1. Accédez à `/admin`
2. Gérez les statuts des commandes
3. Consultez les statistiques de ventes
4. Supprimez les commandes si nécessaire

## 🛠️ Technologies

- **Backend** : Node.js, Express.js
- **Template Engine** : EJS
- **Frontend** : HTML5, CSS3, JavaScript ES6
- **Styling** : CSS personnalisé avec Flexbox/Grid
- **Icons** : Font Awesome 6
- **Fonts** : Google Fonts (Poppins)

## 📊 Structure des données

```json
{
  "id": 1642589123456,
  "studentName": "Marie Diop",
  "items": {
    "beignets": 2,
    "croquettes": 1,
    "popCornes": 3
  },
  "total": 600,
  "status": "En préparation",
  "timestamp": "23/01/2025 14:32:15"
}
```

## 🎨 Design

L'application utilise un design moderne avec :
- **Glassmorphism** et effets de transparence
- **Dégradés colorés** orange/jaune
- **Animations CSS** fluides
- **Layout responsive** pour tous les écrans

## 📝 Statuts des commandes

1. **En attente** ⏳ - Commande reçue
2. **En préparation** 👨‍🍳 - En cours de préparation
3. **Prête** ✅ - Prête à être récupérée
4. **Livrée** 🚚 - Commande terminée

## 🔧 Configuration

L'application utilise le port défini par la variable d'environnement `PORT` ou 3000 par défaut.

## 👨‍💻 Développement

```bash
# Mode développement
npm run dev

# Lancer en production
npm start
```

## 📞 Support

Pour toute question ou support, contactez l'équipe de développement.

---

Développé avec ❤️ pour les étudiants gourmands !
