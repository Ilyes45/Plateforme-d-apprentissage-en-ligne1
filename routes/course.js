const express = require("express");
const router = express.Router();
const isauth = require("../midlleware/isAuth");
const isAdmin = require("../midlleware/isAdmin");
const {
  createCourse,
  getAllCourses,
  assignCourseToUser,
  unassignCourseFromUser,
  updateCourse,
  deleteCourse,
  getCourseById
} = require("../controllers/course");

// Créer un cours
router.post("/addcourse", isauth, isAdmin, createCourse);

// Récupérer tous les cours
router.get("/getCourses", isauth, getAllCourses);
// Récupérer un seul cours
router.get("/:id", isauth, getCourseById);
// Modifier un cours
router.put("/:id", isauth, updateCourse);

// Supprimer un cours
router.delete("/:id", isauth, deleteCourse);

// Assigner/Désassigner
router.post("/assign", isauth, isAdmin, assignCourseToUser);
router.post("/unassign", isauth, isAdmin, unassignCourseFromUser);

module.exports = router;
