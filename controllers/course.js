const Course = require("../models/Course");
const User = require("../models/Users"); // 🔹 Assure-toi d'importer User
const Lesson = require("../models/Lesson");

// Créer un cours
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const course = new Course({
      title,
      description,
      category,
      createdBy: req.user._id
    });
    await course.save();
    res.status(201).json({ message: "Course created", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les cours
exports.getAllCourses = async (req, res) => {
  try {
    let courses;
    if (req.user.role === "admin") {
      courses = await Course.find().populate("lessons").populate("createdBy", "name email").populate("assignedTo", "name email");
    } else {
      // utilisateurs normaux : seulement leurs cours assignés
      courses = await Course.find({ assignedTo: req.user._id })
        .populate("lessons")
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email");
    }
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Cours introuvable" });
    }
    res.status(200).json({ courseToGet: course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Assigner un utilisateur
exports.assignCourseToUser = async (req, res) => {
  try {
    const { courseId, userId } = req.body;
    if (!courseId || !userId) return res.status(400).json({ message: "CourseId et UserId requis" });

    const course = await Course.findById(courseId);
    const user = await User.findById(userId);
    if (!course || !user) return res.status(404).json({ message: "Course ou User introuvable" });

    if (!course.assignedTo.includes(userId)) {
      course.assignedTo.push(userId);
      await course.save();
    }

    const populatedCourse = await Course.findById(courseId).populate("assignedTo", "name email");
    res.status(200).json({ course: populatedCourse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unassignCourseFromUser = async (req, res) => {
  try {
    const { courseId, userId } = req.body;
    if (!courseId || !userId)
      return res.status(400).json({ message: "CourseId et UserId requis" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course introuvable" });

    // ✅ retirer l'utilisateur de la liste des assignés
    course.assignedTo = course.assignedTo.filter(
      (id) => id.toString() !== userId.toString()
    );
    await course.save();

    // ✅ retirer aussi le cours des completedCourses de l'utilisateur
    await User.findByIdAndUpdate(userId, { 
      $pull: { completedCourses: courseId } 
    });

    // ✅ Récupérer le cours mis à jour
    const populatedCourse = await Course.findById(courseId)
      .populate("assignedTo", "name email");

    res.status(200).json({ course: populatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// Modifier un cours
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Cours introuvable" });

    // Vérification : seul l'admin ou le créateur peut modifier
    if (req.user.role !== "admin" && course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;

    await course.save();
    res.status(200).json({ message: "Cours mis à jour", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un cours
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Cours introuvable" });

    // Vérification : seul l'admin ou le créateur peut supprimer
    if (req.user.role !== "admin" && course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: "Cours supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
