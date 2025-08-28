const express = require("express");
const router = express.Router();
const isauth = require("../midlleware/isAuth");
const isAdmin = require("../midlleware/isAdmin");
const { createLesson, getAllLessons, getOneLesson, editLesson, deleteLesson } = require("../controllers/lesson");

// Créer une leçon
router.post("/addlesson", isauth, isAdmin, createLesson);

// Récupérer toutes les leçons
router.get("/getLessons", getAllLessons);

// Récupérer une leçon par ID
router.get("/:id", getOneLesson);

// Modifier une leçon
router.put("/:_id", isauth, isAdmin, editLesson);

// Supprimer une leçon
router.delete("/:_id", isauth, isAdmin, deleteLesson);

module.exports = router;
