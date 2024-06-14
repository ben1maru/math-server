const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../db");
const SECRET = process.env.JWT_SECRET;

router.get('/user', async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
      // Розкодування токену
      const decoded = jwt.verify(token, SECRET);
      const userId = decoded.userId;

      // Отримання користувача з бази даних за його ідентифікатором
      const sql = 'SELECT * FROM `users` WHERE `id` = ?';
      db.query(sql, [userId], (error, results) => {
          if (error) {
              console.error('Error occurred during user retrieval:', error);
              return res.status(500).json({ error: 'Internal server error' });
          }

          if (results.length === 0) {
              return res.status(404).json({ message: 'User not found' });
          }

          const user = results[0];
          // Повертаємо дані користувача
          res.json(user);
      });
  } catch (error) {
      console.error('Error occurred during token verification:', error);
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Отримуємо користувача з бази даних за email
    const sql = "SELECT * FROM `users` WHERE `email` = ?";
    db.query(sql, [email], async (error, results) => {
      if (error) {
        console.error("Error occurred during login:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      // Перевіряємо, чи знайдено користувача
      if (results.length === 0) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      const user = results[0];
      // Порівнюємо введений пароль з хешованим паролем з бази даних
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      // Генеруємо JWT токен
      const token = jwt.sign({ userId: user.id }, SECRET, {
        expiresIn: "1h",
      });

      // Повертаємо токен
      res.json({ token });
    });
  } catch (error) {
    console.error("Error occurred during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  const {  email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    // Записуємо користувача в базу даних з хешованим паролем
    const sql =
      "INSERT INTO `users` (`email`, `password`) VALUES (?, ?)";
    const values = [ email, hashedPassword, 0]; // Додано хешований пароль
    db.query(sql, values, (error, results, fields) => {
      if (error) {
        console.error("Error occurred during registration:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      // Успішна вставка
      res.status(200).json({ message: "Registration successful" });
    });
  } catch (error) {
    console.error("Error occurred during password hashing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/loginAdmin', async (req, res) => {
  const { email, password } = req.body;

  try {
      // Отримуємо користувача з бази даних за email
      const sql = "SELECT * FROM `users` WHERE `email` = ?";
      db.query(sql, [email], async (error, results) => {
          if (error) {
              console.error("Error occurred during login:", error);
              res.status(500).json({ error: "Internal server error" });
              return;
          }

          // Перевіряємо, чи знайдено користувача
          if (results.length === 0) {
              res.status(401).json({ message: "Invalid email or password" });
              return;
          }

          const user = results[0];

          // Порівнюємо введений пароль з хешованим паролем з бази даних
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
              res.status(401).json({ message: "Invalid email or password" });
              return;
          }

          // Повертаємо статус адміністратора
          res.json({ isAdmin: user.status });
      });
  } catch (error) {
      console.error("Error occurred during login:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
