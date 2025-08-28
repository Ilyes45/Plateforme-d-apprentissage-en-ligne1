const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const User = require("../models/Users");
const Quiz=require("../models/Quiz");
// Créer un nouveau quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, questions, lessonId } = req.body;

    // Créer le quiz
    const quiz = new Quiz({
      title,
      questions,
      lessonId,
      createdBy: req.user._id,
    });
    await quiz.save();

    // Lier le quiz à la leçon
    if (lessonId) {
      await Lesson.findByIdAndUpdate(lessonId, { quiz: quiz._id });
    }

    res.status(201).json({ message: "Quiz créé et lié à la leçon", quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les quiz (optionnel par lesson)
exports.getQuizzes = async (req, res) => {
  try {
    const { lessonId } = req.query;
    let filter = {};

    if (lessonId) {
      const lesson = await Lesson.findById(lessonId);
      if (!lesson) return res.status(404).json({ message: "Lesson not found" });
      if (lesson.quiz) filter._id = lesson.quiz;
      else return res.status(200).json({ quizzes: [] });
    }

    const quizzes = await Quiz.find(filter);
    res.status(200).json({ quizzes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un quiz par ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.status(200).json({ quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un quiz par lessonId
exports.getQuizzesByLessonId = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId).populate("quiz");
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    if (!lesson.quiz) return res.status(200).json({ quizzes: [] });
    res.status(200).json({ quizzes: [lesson.quiz] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier un quiz
exports.updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedQuiz) return res.status(404).json({ message: "Quiz not found" });
    res.status(200).json({ message: "Quiz mis à jour", quiz: updatedQuiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params._id);
    if (!deletedQuiz) return res.status(404).json({ message: "Quiz not found" });

    // Retirer le quiz de la leçon
    if (deletedQuiz.lessonId) {
      await Lesson.findByIdAndUpdate(deletedQuiz.lessonId, { $pull: { quiz: deletedQuiz._id } });
    }

    // Retirer ce quiz de tous les utilisateurs
    await User.updateMany(
      { completedQuizzes: deletedQuiz._id },
      { $pull: { completedQuizzes: deletedQuiz._id } }
    );

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
