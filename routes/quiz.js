const express = require('express');
const isauth = require('../midlleware/isAuth');
const isAdmin = require('../midlleware/isAdmin');
const {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getQuizByLessonId,
  
} = require('../controllers/quiz');

const router = express.Router();

router.post('/addquiz', isauth, isAdmin, createQuiz);
router.get('/', getQuizzes);     
router.get('/:id', getQuizById); 
router.get('/lesson/:lessonId', getQuizByLessonId);
router.put('/:id', isauth, isAdmin, updateQuiz);
router.delete('/:id', isauth, isAdmin, deleteQuiz);

module.exports = router;
