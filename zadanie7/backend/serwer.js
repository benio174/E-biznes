const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 5000;
require('dotenv').config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = "http://localhost:5000/api/auth/google/callback";
const JWT_SECRET = process.env.JWT_SECRET || "domyslny_klucz_awaryjny";

const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const usersDatabase = [
  {
    id: 1,
    email: "test@example.com",
    passwordHash: bcrypt.hashSync("haslo123", 10) 
  }
];

app.post('/api/login', async (req, res) => {
  console.log("Dane odebrane z Reacta:", req.body);
  try {
    const { email, password } = req.body;

    const user = usersDatabase.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Nieprawidłowy email lub hasło' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Nieprawidłowy email lub hasło' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000 
    });

    return res.status(200).json({
      message: 'Zalogowano pomyślnie!',
      user: { id: user.id, email: user.email }
    });

  } catch (error) {
    return res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email i hasło są wymagane.' });
    }

    const userExists = usersDatabase.find(u => u.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'Użytkownik o takim adresie email już istnieje.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: usersDatabase.length + 1,
      email: email,
      passwordHash: hashedPassword
    };

    usersDatabase.push(newUser);
    console.log("Dodano nowego użytkownika do bazy:", newUser);

    return res.status(201).json({ message: 'Rejestracja zakończona sukcesem! Możesz się teraz zalogować.' });

  } catch (error) {
    return res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
});

app.get('/api/auth/google', (req, res) => {
  const url = googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
  });
  res.redirect(url);
});

app.get('/api/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // 1. Wymieniamy kod od Google na tokeny dostępu
    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    const googleId = payload['sub'];
    const email = payload['email'];

    let user = usersDatabase.find(u => u.email === email);

    if (!user) {
      user = {
        id: usersDatabase.length + 1,
        email: email,
        googleId: googleId,
        passwordHash: null
      };
      usersDatabase.push(user);
      console.log("Zarejestrowano nowego użytkownika przez Google OAuth2:", user);
    } else {
      user.googleId = googleId;
      console.log("Zalogowano istniejącego użytkownika przez Google OAuth2:", user);
    }

    const ourToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', ourToken, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000
    });

    res.redirect('http://localhost:3000?status=success');

  } catch (error) {
    console.error("Błąd OAuth2:", error);
    res.redirect('http://localhost:3000?status=error');
  }
});

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});