require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Configuration PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/madibo_delices',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Configuration des produits
const products = {
    beignets: { name: 'Beignets', price: 100 },
    croquettes: { name: 'Croquettes', price: 100 },
    popCornes: { name: 'Pop-cornes', price: 100 }
};

// Initialisation de la base de données
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS commandes (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        items JSONB NOT NULL,
        total INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'En attente',
        created_at TIMESTAMP DEFAULT NOW(),
        timestamp VARCHAR(100)
      )
    `);
    console.log('✅ Base de données initialisée');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la DB:', error);
  }
}

initDatabase();

// Page de commande (client)
app.get('/', (req, res) => {
  res.render('client', { products });
});

// API pour récupérer les commandes (ADMIN SEULEMENT)
app.get('/api/commandes', async (req, res) => {
  // Vérifier l'authentification admin
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  if (adminKey !== 'madibo2024') {
    return res.status(403).json({ error: 'Accès refusé - Admin seulement' });
  }
  
  try {
    const result = await pool.query(
      'SELECT * FROM commandes ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur DB:', error);
    res.status(500).json({ error: 'Erreur lors de la lecture des commandes' });
  }
});

// Envoi de la commande
app.post('/commander', async (req, res) => {
  try {
    const { studentName, items, total } = req.body;
    
    await pool.query(`
      INSERT INTO commandes (student_name, items, total, timestamp)
      VALUES ($1, $2, $3, $4)
    `, [
      studentName,
      JSON.stringify(items),
      total,
      new Date().toLocaleString('fr-FR')
    ]);

    res.json({ success: true, message: 'Commande reçue avec succès!' });
  } catch (error) {
    console.error('Erreur DB:', error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la commande' });
  }
});

// Mise à jour du statut d'une commande
app.put('/api/commandes/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE commandes SET status = $1 WHERE id = $2',
      [status, id]
    );
    
    if (result.rowCount > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Commande non trouvée' });
    }
  } catch (error) {
    console.error('Erreur DB:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// Suppression d'une commande
app.delete('/api/commandes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM commandes WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur DB:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// Page admin (avec mot de passe)
app.get('/admin', async (req, res) => {
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
    const result = await pool.query('SELECT * FROM commandes ORDER BY created_at DESC');
    res.render('admin', { commandes: result.rows, products });
  } catch (error) {
    console.error('Erreur DB:', error);
    res.render('admin', { commandes: [], products });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));
