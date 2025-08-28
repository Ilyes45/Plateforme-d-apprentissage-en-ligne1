const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const Quiz = require("../models/Quiz"); 
const User = require("../models/Users");

// Créer une leçon
exports.createLesson = async (req, res) => {
  try {
    const { title, content, courseId } = req.body;

    const lesson = new Lesson({
      title,
      content,
      courseId,
      createdBy: req.user._id
    });
    await lesson.save();

    // Ajouter automatiquement la leçon au cours
    if (courseId) {
      await Course.findByIdAndUpdate(courseId, { $push: { lessons: lesson._id } });
    }

    res.status(201).json({ message: "Leçon créée", lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer toutes les leçons (optionnel par course)
exports.getAllLessons = async (req, res) => {
  try {
    const filter = {};
    if (req.query.courseId) filter.courseId = req.query.courseId;

    const lessons = await Lesson.find(filter).populate("quiz");
    res.status(200).json({ lessons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une leçon par ID
exports.getOneLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("quiz");
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.status(200).json({ lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier une leçon
exports.editLesson = async (req, res) => {
  try {
    const updated = await Lesson.findByIdAndUpdate(req.params._id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Lesson not found" });
    res.status(200).json({ message: "Lesson updated", lesson: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une leçon
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params._id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    // Supprimer le quiz lié
    if (lesson.quiz) {
      const deletedQuiz = await Quiz.findByIdAndDelete(lesson.quiz);
      if (deletedQuiz) {
        // Retirer le quiz des utilisateurs
        await User.updateMany(
          { completedQuizzes: deletedQuiz._id },
          { $pull: { completedQuizzes: deletedQuiz._id } }
        );
      }
    }

    // Retirer la leçon du cours
    if (lesson.courseId) {
      await Course.findByIdAndUpdate(lesson.courseId, { $pull: { lessons: lesson._id } });
    }

    // Retirer la leçon de tous les utilisateurs
    await User.updateMany(
      { completedLessons: lesson._id },
      { $pull: { completedLessons: lesson._id } }
    );

    // Supprimer la leçon
    await Lesson.findByIdAndDelete(lesson._id);

    res.status(200).json({ message: "Lesson and its quiz deleted successfully" });
  } catch (error) {
    console.error("Delete Lesson Error:", error);
    res.status(500).json({ message: error.message });
  }
};