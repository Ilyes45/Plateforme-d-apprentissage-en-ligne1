const express = require("express");
const router = express.Router();
const isauth = require("../midlleware/isAuth");
const isAdmin = require("../midlleware/isAdmin");

const {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getQuizzesByLessonId
} = require("../controllers/quiz");

// Créer un quiz

// Créer un quiz pour une leçon
router.post("/addquiz", isauth, isAdmin, createQuiz);

// Récupérer tous les quiz
router.get("/", getQuizzes);

// Récupérer quiz par lesson (mettre avant /:id)
router.get("/lesson/:lessonId", getQuizzesByLessonId);

// Récupérer quiz par ID
router.get("/:id", getQuizById);

// Modifier un quiz
router.put("/:id", isauth, isAdmin, updateQuiz);

// Supprimer un quiz
router.delete("/:id", isauth, isAdmin, deleteQuiz);

module.exports = router;
