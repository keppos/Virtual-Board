/**
 * Virtual Board - Authentication API (Del 1)
 * 
 * Detta API hanterar användarautentisering för Virtual Board-applikationen.
 * Funktioner:
 * - Registrering av nya användare med bcrypt-hashade lösenord
 * - Inloggning med JWT-token
 * - Skyddade endpoints med JWT
 * 
 * Tech-stack: Node.js, Express, Prisma (PostgreSQL), bcryptjs, JWT
 */

require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Initiera Express och Prisma
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;


// Middleware

app.use(cors());
app.use(express.json());

// Middleware för JWT-verifiering

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrahera token från Bearer token

  if (!token) {
    return res.status(401).json({ error: 'Token saknas' });
  }

  // Verifiera token med samma JWT_SECRET som användes vid skapande
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Ogiltig token' });
    }
    // Lägg till user-data från token till request object
    req.user = user;
    next();
  });
};

// Registrering
// POST /register skapar en ny användare, lösenordet hashas med bcrypt

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Användarnamn och lösenord krävs' });
    }

    // Kolla om användaren redan finns
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Användarnamnet är redan taget' });
    }

    // Hasha lösenordet
    const hashedPassword = await bcrypt.hash(password, 10);

    // Skapa användaren
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    });

    res.status(201).json({
      message: 'Användare skapad',
      userId: user.id,
      username: user.username
    });
  } catch (error) {
    console.error('Registreringsfel:', error);
    res.status(500).json({ error: 'Serverfel vid registrering' });
  }
});

// Logga in
// POST /login autentiserar användaren och returnerar en JWT-token, som är giltig i 24h och innehåller userId, username och boards.

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Användarnamn och lösenord krävs' });
    }

    // Hitta användaren
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({ error: 'Felaktigt användarnamn eller lösenord' });
    }

    // Verifiera lösenordet
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Felaktigt användarnamn eller lösenord' });
    }

    // Skapa JWT-token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        boards: [] // Tomt för nu, kan fyllas på senare med användarens boards
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Inloggning lyckades',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Inloggningsfel:', error);
    res.status(500).json({ error: 'Serverfel vid inloggning' });
  }
});

// Hämta boards
// GET /boards hämtar en lista boards som användaren har åtkomst till. 
// Detta kräver en giltig JWT-token i Authorization header.

app.get('/boards', authenticateToken, async (req, res) => {
  try {
    // För nu returnerar vi bara en tom array
    // Detta kan utökas senare när boards-funktionalitet läggs till
    res.json({
      userId: req.user.userId,
      username: req.user.username,
      boards: req.user.boards || []
    });
  } catch (error) {
    console.error('Fel vid hämtning av boards:', error);
    res.status(500).json({ error: 'Serverfel vid hämtning av boards' });
  }
});

// Health check
// GET / hämtar en health check

app.get('/', (req, res) => {
  res.json({ message: 'Virtual Board Auth API körs!' });
});

// Starta Express server
app.listen(PORT, () => {
  console.log(`Auth API körs på http://localhost:${PORT}`);
});

// Stäng databaskoppling vid CTRL+C
process.on('SIGINT', async () => {
  console.log('\nStänger av servern...');
  await prisma.$disconnect();
  console.log('Databaskoppling stängd.');
  process.exit(0);
});
