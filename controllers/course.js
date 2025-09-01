const Course = require("../models/Course");
const User = require("../models/Users"); // Ensure User model is imported
const Lesson = require("../models/Lesson");

// ---------------- CREATE COURSE ----------------
// Create a new course and assign the creator
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const course = new Course({
      title,
      description,
      category,
      createdBy: req.user._id // link course to the creator
    });
    await course.save();
    res.status(201).json({ message: "Course created", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ---------------- GET ALL COURSES ----------------
exports.getAllCourses = async (req, res) => {
  try {
    let courses;

    if (!req.user) {
      // 🚀 Cas visiteur : afficher tous les cours sans restriction
      courses = await Course.find()
        .populate("lessons")
        .populate("createdBy", "name email");
    } else if (req.user.role === "admin") {
      // 🚀 Admin : tous les cours
      courses = await Course.find()
        .populate("lessons")
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email");
    } else {
      // 🚀 User connecté : seulement ses cours
      courses = await Course.find({ assignedTo: req.user._id })
        .populate("lessons")
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email");
    }

    res.status(200).json({ courses });
  } catch (error) {
    console.error("Error in getAllCourses:", error);
    res.status(500).json({ message: error.message });
  }
};

// ---------------- GET COURSE BY ID ----------------
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

// ---------------- ASSIGN COURSE TO USER ----------------
exports.assignCourseToUser = async (req, res) => {
  try {
    const { courseId, userId } = req.body;
    if (!courseId || !userId) return res.status(400).json({ message: "CourseId et UserId requis" });

    const course = await Course.findById(courseId);
    const user = await User.findById(userId);
    if (!course || !user) return res.status(404).json({ message: "Course ou User introuvable" });

    // Add user to assignedTo if not already assigned
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

// ---------------- UNASSIGN COURSE FROM USER ----------------
exports.unassignCourseFromUser = async (req, res) => {
  try {
    const { courseId, userId } = req.body;
    if (!courseId || !userId)
      return res.status(400).json({ message: "CourseId et UserId requis" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course introuvable" });

    // Remove user from assignedTo list
    course.assignedTo = course.assignedTo.filter(
      (id) => id.toString() !== userId.toString()
    );
    await course.save();

    // Remove course from user's completedCourses
    await User.findByIdAndUpdate(userId, { 
      $pull: { completedCourses: courseId } 
    });

    // Get updated course with populated assignedTo
    const populatedCourse = await Course.findById(courseId)
      .populate("assignedTo", "name email");

    res.status(200).json({ course: populatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ---------------- UPDATE COURSE ----------------
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Cours introuvable" });

    // Only admin or creator can update
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

// ---------------- DELETE COURSE ----------------
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Cours introuvable" });

    // Only admin or creator can delete
    if (req.user.role !== "admin" && course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: "Cours supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
