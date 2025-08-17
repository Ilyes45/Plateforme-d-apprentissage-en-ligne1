const Quiz = require('../models/Quiz');
const User = require("../models/Users");
// Créer un nouveau quiz
exports.createQuiz = async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les quiz (optionnellement par lessonId)
exports.getQuizzes = async (req, res) => {
  try {
    const { lessonId } = req.query;
    let filter = {};
    if (lessonId) filter.lessonId = lessonId;

    const quizzes = await Quiz.find(filter);
    res.status(200).json({ quizzes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un quiz par son ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json({ quizToGet: quiz }); // <-- important pour Redux
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un quiz par lessonId
exports.getQuizByLessonId = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ lessonId: req.params.lessonId });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found for this lesson' });
    res.status(200).json({ quizToGet: quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier un quiz
exports.updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedQuiz) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!deletedQuiz) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Marquer un quiz comme complété
exports.markQuizCompleted = async (req, res) => {
  try {
    const userId = req.user._id;
    const { quizId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    if (user.completedQuizzes.includes(quizId)) {
      return res.status(400).json({ message: "Quiz déjà complété" });
    }

    user.completedQuizzes.push(quizId);
    await user.save();

    res.json({ message: "Quiz complété avec succès" });
  } catch (error) {
    console.error("Erreur markQuizCompleted:", error);
    res.status(500).json({ message: error.message });
  }
};
