const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Support pour JSON
app.use(express.static('public'));
app.set('view engine', 'ejs');

const commandesFile = path.join(__dirname, 'data', 'commandes.json');

// Configuration des produits
const products = {
    beignets: { name: 'Beignets', price: 100 },
    croquettes: { name: 'Croquettes', price: 100 },
    popCornes: { name: 'Pop-cornes', price: 100 }
};

// Initialisation du fichier de commandes s'il n'existe pas
if (!fs.existsSync(path.dirname(commandesFile))) {
  fs.mkdirSync(path.dirname(commandesFile), { recursive: true });
}
if (!fs.existsSync(commandesFile)) {
  fs.writeFileSync(commandesFile, JSON.stringify([], null, 2));
}

// Page de commande (client)
app.get('/', (req, res) => {
  res.render('client', { products });
});

// API pour récupérer les commandes (ADMIN SEULEMENT)
app.get('/api/commandes', (req, res) => {
  // Vérifier l'authentification admin
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  if (adminKey !== 'madibo2024') {
    return res.status(403).json({ error: 'Accès refusé - Admin seulement' });
  }
  
  try {
    const commandes = JSON.parse(fs.readFileSync(commandesFile, 'utf-8'));
    res.json(commandes);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des commandes' });
  }
});

// Envoi de la commande (nouvelle version)
app.post('/commander', (req, res) => {
  try {
    const { studentName, items, total } = req.body;
    
    const nouvelleCommande = {
      id: Date.now(),
      studentName: studentName,
      items: items,
      total: total,
      date: new Date().toISOString(),
      timestamp: new Date().toLocaleString('fr-FR'),
      status: 'En attente'
    };

    const commandes = JSON.parse(fs.readFileSync(commandesFile, 'utf-8'));
    commandes.unshift(nouvelleCommande);
    fs.writeFileSync(commandesFile, JSON.stringify(commandes, null, 2));

    res.json({ success: true, message: 'Commande reçue avec succès!' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la commande' });
  }
});

// Mise à jour du statut d'une commande
app.put('/api/commandes/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const commandes = JSON.parse(fs.readFileSync(commandesFile, 'utf-8'));
    const commandeIndex = commandes.findIndex(cmd => cmd.id == id);
    
    if (commandeIndex !== -1) {
      commandes[commandeIndex].status = status;
      fs.writeFileSync(commandesFile, JSON.stringify(commandes, null, 2));
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Commande non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// Suppression d'une commande
app.delete('/api/commandes/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const commandes = JSON.parse(fs.readFileSync(commandesFile, 'utf-8'));
    const nouvellesCommandes = commandes.filter(cmd => cmd.id != id);
    
    fs.writeFileSync(commandesFile, JSON.stringify(nouvellesCommandes, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// Page admin (avec mot de passe)
app.get('/admin', (req, res) => {
  const password = req.query.password;
  if (password !== 'madibo2024') {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Accès Admin</title><style>
        body{font-family:Arial;max-width:400px;margin:100px auto;padding:20px;text-align:center}
        input,button{padding:10px;margin:10px;font-size:16px}
        button{background:#f97316;color:white;border:none;border-radius:5px;cursor:pointer}
      </style></head>
      <body>
        <h2>🔐 Accès Administrateur</h2>
        <form method="GET">
          <input type="password" name="password" placeholder="Mot de passe" required>
          <br><button type="submit">Accéder</button>
        </form>
      </body>
      </html>
    `);
  }
  
  try {
    const commandes = JSON.parse(fs.readFileSync(commandesFile, 'utf-8'));
    res.render('admin', { commandes, products });
  } catch (error) {
    res.render('admin', { commandes: [], products });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));
