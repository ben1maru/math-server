const express = require("express");
const router = express.Router();
const db = require("../db");

router.get('/scoreboard', (req, res) => {
    // Запит до бази даних для отримання всіх даних з таблиці успішності
    const queryString = `
        SELECT scoreboard.*, users.username, level.name AS level_name, category.name AS category_name
        FROM scoreboard
        INNER JOIN users ON scoreboard.id_user = users.id
        INNER JOIN level ON scoreboard.id_level = level.id
        INNER JOIN category ON scoreboard.id_category = category.id
    `;

    db.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log('Failed to query for scoreboard: ' + err);
            res.sendStatus(500);
            return;
        }

        // Формування відповіді з отриманими даними
        const scoreboardData = rows.map(row => {
            return {
                id: row.id,
                userId: row.id_user,
                score: row.score,
                levelId: row.id_level,
                categoryId: row.id_category,
                username: row.username,
                level: row.level_name,
                category: row.category_name
            };
        });

        res.json(scoreboardData);
        console.log(scoreboardData);
    });
});


router.post('/scoreboardPushData', (req, res) => {
    const { userId, score, levelId, categoryId } = req.body;
  
    console.log('Received data:', { userId, score, levelId, categoryId }); // Логування вхідних даних
  
    // Валідація вхідних даних
    if (userId == null || score == null || levelId == null || categoryId == null) {
      console.error('Missing required fields');
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    // Перевірка типів даних
    if (typeof userId !== 'number' || typeof score !== 'number' || typeof levelId !== 'number' || typeof categoryId !== 'number') {
      console.error('Invalid data types');
      return res.status(400).json({ message: 'Invalid data types' });
    }
  
    const sql = 'INSERT INTO scoreboard (id_user, score, id_level, id_category) VALUES (?, ?, ?, ?)';
    db.query(sql, [userId, score, levelId, categoryId], (error, results) => {
      if (error) {
        console.error('Error occurred during inserting score data:', error); // Логування помилки
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(200).json({ message: 'Score data successfully pushed to the database' });
    });
  });

module.exports = router;