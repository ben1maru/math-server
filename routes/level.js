
const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/level', (req, res) => {
  db.query('SELECT * FROM level', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

router.post('/levelInsert',  (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO level (name) VALUES (?)', [name], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send('level created');
  });
});

router.put('/:id',  (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  db.query('UPDATE level SET name = ? WHERE id = ?', [name, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('level updated');
  });
});

router.delete('/:id',  (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM level WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('level deleted');
  });
});

module.exports = router;
