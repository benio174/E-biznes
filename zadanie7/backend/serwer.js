const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 5000;
const JWT_SECRET = "tajny_klucz_123";

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

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});