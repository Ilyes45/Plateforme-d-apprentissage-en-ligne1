const express = require('express');
const { register, login, updateUser, getUser, markQuizCompleted, completeLesson, getAllUsers, deleteUser, getUserProgress } = require('../controllers/user');
const { registerValidation, loginValidation, validate } = require('../midlleware/valdation');
const isauth = require('../midlleware/isAuth');
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const isAdmin = require('../midlleware/isAdmin');

const router = express.Router();

// Register
router.post('/register', upload.single("image"), registerValidation(), validate, register);

// Login
router.post('/login', loginValidation(), validate, login);

// Current user
router.get('/current', isauth, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: no valid token" });
  }
  res.json(req.user);
});

// Update user
router.put('/:id', isauth, upload.single("image"), updateUser);

// Get one user
router.get('/:id', isauth, getUser);

// Mark quiz completed
router.post("/:quizId/complete", isauth, markQuizCompleted);

// Mark lesson completed
router.post("/lesson/:lessonId/complete", isauth, completeLesson);

// Get all users (admin only)
router.get("/", isauth, isAdmin, getAllUsers);

// delete user
router.delete("/:_id",isauth,deleteUser);

router.get("/:userId/progress", isauth, getUserProgress);



module.exports = router;
