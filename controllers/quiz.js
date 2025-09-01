const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const User = require("../models/Users");
const Quiz=require("../models/Quiz");

// ---------------- CREATE QUIZ ----------------
// Create a new quiz and optionally link it to a lesson
exports.createQuiz = async (req, res) => {
  try {
    const { title, questions, lessonId } = req.body;

    // Create the quiz with title, questions, lesson reference and creator
    const quiz = new Quiz({
      title,
      questions,
      lessonId,
      createdBy: req.user._id,
    });
    await quiz.save();

    // Link quiz to the lesson if lessonId is provided
    if (lessonId) {
      await Lesson.findByIdAndUpdate(lessonId, { quiz: quiz._id });
    }

    res.status(201).json({ message: "Quiz created and linked to lesson", quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- GET ALL QUIZZES ----------------
// Retrieve all quizzes, optionally filtered by lesson
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

// ---------------- GET QUIZ BY ID ----------------
// Retrieve one quiz by its ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.status(200).json({ quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- GET QUIZZES BY LESSON ID ----------------
// Retrieve quizzes associated with a specific lesson
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

// ---------------- UPDATE QUIZ ----------------
// Update quiz information by ID
exports.updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedQuiz) return res.status(404).json({ message: "Quiz not found" });
    res.status(200).json({ message: "Quiz updated", quiz: updatedQuiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- DELETE QUIZ ----------------
// Delete a quiz, unlink it from lesson and users
exports.deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params._id);
    if (!deletedQuiz) return res.status(404).json({ message: "Quiz not found" });

    // Remove quiz reference from lesson
    if (deletedQuiz.lessonId) {
      await Lesson.findByIdAndUpdate(deletedQuiz.lessonId, { $pull: { quiz: deletedQuiz._id } });
    }

    // Remove quiz reference from all users who completed it
    await User.updateMany(
      { completedQuizzes: deletedQuiz._id },
      { $pull: { completedQuizzes: deletedQuiz._id } }
    );

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
