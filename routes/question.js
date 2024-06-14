const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/questions", (req, res) => {
  const sql =
    "SELECT `id`,`photo`, `question`, `answer`, `correct_answer`, `id_level`, `id_themes`, `description` FROM `question`";
  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    // Формуємо дані з варіантами відповідей
    const questions = results.map((q) => {
      return {
        ...q,
        answers: JSON.parse(q.answer), // Перетворюємо рядок JSON у масив
      };
    });
    res.json(questions);
  });
});
router.delete("/questionsDelete/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM `question` WHERE `id` = ?";
  db.query(sql, [id], (error, results) => {
    if (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    // Перевіряємо, чи було видалено якесь питання
    if (results.affectedRows === 0) {
      res.status(404).json({ error: "Question not found" });
      return;
    }

    res.json({ message: "Question deleted successfully" });
  });
});


router.post("/questionsUpdate/:id", (req, res) => {
  const { id } = req.params;
  const { photo, question, answers, correct_answer, id_level, id_themes, description } = req.body;

  // Перевірка, чи дані в полі "answers" вже є у форматі JSON
  const answerData = typeof answers === 'string' ? JSON.parse(answers) : answers;

  const sql = `UPDATE question 
               SET photo = ?, 
                   question = ?, 
                   answer = ?, 
                   correct_answer = ?, 
                   id_level = ?, 
                   id_themes = ?, 
                   description = ? 
               WHERE id = ?`;
  db.query(sql, [photo, question, JSON.stringify(answerData), correct_answer, id_level, id_themes, description, id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json({ message: "Question updated successfully" });
  });
});



router.post("/questionsPush", (req, res) => {
  // Отримання даних про питання з тіла запиту
  const { photo, question, answer, correct_answer, id_level, id_themes, description } = req.body;

  // Перевірка, чи отримано всі необхідні дані
  if (!photo || !question || !answer || !correct_answer || !id_level || !id_themes) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Вставка нового питання у базу даних
  const sql = "INSERT INTO question (photo, question, answer, correct_answer, id_level, id_themes, description) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [photo, question, JSON.stringify(answer), correct_answer, id_level, id_themes, description], (error, results) => {
    if (error) {
      console.error("Error inserting question:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(201).json({ message: "Question successfully inserted" });
  });
});

router.get("/questionsEdit/:id", (req, res) => {
  const { id } = req.params;

  const sql =
    "SELECT `id`, `photo`, `question`, `answer`, `correct_answer`, `id_level`, `id_themes`, `description` FROM `question` WHERE `id` = ? ";
  
  db.query(sql, [id], (error, results) => {
    if (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    // Одразу використовуйте results, без обробки в мапі
    console.log("Fetched question data:", results); // Додайте цей рядок для виведення результатів у консоль
    res.json(results);
  });
});


router.get("/questionsAdmin", (req, res) => {
  const sql = `
    SELECT q.id, q.photo, q.question, q.answer, q.correct_answer, l.name AS level_name, c.name AS category_name, q.id_themes, q.description 
    FROM question q 
    JOIN level l ON q.id_level = l.id 
    JOIN category c ON q.id_themes = c.id;
  `;
  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ error: "Internal server error" });
      
      return;
    }
    // Формуємо дані з варіантами відповідей
    const questions = results.map((q) => {
      return {
        ...q,
        answers: JSON.parse(q.answer), // Перетворюємо рядок JSON у масив
      };
    });
    
    res.json(questions);
  
  });
  
});


router.get("/questions/:id_level/:id_themes", (req, res) => {
    const { id_level, id_themes } = req.params;
  
    const sql =
      "SELECT `id`, `photo`, `question`, `answer`, `correct_answer`, `id_level`, `id_themes`, `description` FROM `question` WHERE `id_level` = ? AND `id_themes` = ?";
    
    db.query(sql, [id_level, id_themes], (error, results) => {
      if (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      // Формуємо дані з варіантами відповідей
      const questions = results.map((q) => {
        return {
          ...q,
          answers: JSON.parse(q.answer), // Перетворюємо рядок JSON у масив
        };
      });
      res.json(questions);
    });
  });
  
  module.exports = router;
