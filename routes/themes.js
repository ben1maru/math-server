const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/theme", (req, res) => {
  db.query("SELECT * FROM category", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { name } = req.body;
  db.query("INSERT INTO category (name) VALUES (?)", [name], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send("Category created");
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  db.query(
    "UPDATE category SET name = ? WHERE id = ?",
    [name, id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send("Category updated");
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM category WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("Category deleted");
  });
});

module.exports = router;
