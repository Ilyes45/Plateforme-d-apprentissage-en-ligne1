const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const Quiz = require("../models/Quiz"); 
const User = require("../models/Users");

// ---------------- CREATE LESSON ----------------
// Create a new lesson and optionally link it to a course
exports.createLesson = async (req, res) => {
  try {
    const { title, content, courseId } = req.body;

    const lesson = new Lesson({
      title,
      content,
      courseId,
      createdBy: req.user._id // link lesson to the creator
    });
    await lesson.save();

    // Automatically add lesson to course
    if (courseId) {
      await Course.findByIdAndUpdate(courseId, { $push: { lessons: lesson._id } });
    }

    res.status(201).json({ message: "Lesson created", lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- GET ALL LESSONS ----------------
// Retrieve all lessons, optionally filtered by course
exports.getAllLessons = async (req, res) => {
  try {
    const filter = {};
    if (req.query.courseId) filter.courseId = req.query.courseId;

    const lessons = await Lesson.find(filter).populate("quiz"); // include linked quiz
    res.status(200).json({ lessons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- GET ONE LESSON ----------------
// Retrieve a single lesson by ID
exports.getOneLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("quiz");
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.status(200).json({ lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- EDIT LESSON ----------------
// Update a lesson by ID
exports.editLesson = async (req, res) => {
  try {
    const updated = await Lesson.findByIdAndUpdate(req.params._id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Lesson not found" });
    res.status(200).json({ message: "Lesson updated", lesson: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- DELETE LESSON ----------------
// Delete a lesson, its quiz, and update related users & course
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params._id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    // Delete linked quiz if exists
    if (lesson.quiz) {
      const deletedQuiz = await Quiz.findByIdAndDelete(lesson.quiz);
      if (deletedQuiz) {
        // Remove this quiz from all users
        await User.updateMany(
          { completedQuizzes: deletedQuiz._id },
          { $pull: { completedQuizzes: deletedQuiz._id } }
        );
      }
    }

    // Remove lesson from its course
    if (lesson.courseId) {
      await Course.findByIdAndUpdate(lesson.courseId, { $pull: { lessons: lesson._id } });
    }

    // Remove lesson from all users
    await User.updateMany(
      { completedLessons: lesson._id },
      { $pull: { completedLessons: lesson._id } }
    );

    // Delete lesson itself
    await Lesson.findByIdAndDelete(lesson._id);

    res.status(200).json({ message: "Lesson and its quiz deleted successfully" });
  } catch (error) {
    console.error("Delete Lesson Error:", error);
    res.status(500).json({ message: error.message });
  }
};
