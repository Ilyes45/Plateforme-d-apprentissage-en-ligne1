const User = require("../models/Users");
const Course = require("../models/Course");
const Quiz = require("../models/Quiz");
// require bcrypt for password hashing
const bcrypt = require('bcrypt');
// require jsonwebtoken for authentication tokens
const jwt = require('jsonwebtoken');
// require cloudinary for image upload
const cloudinary = require("../utils/cloudinary");

// ---------------- REGISTER USER ----------------
exports.register = async(req, res) => {
    try {
        // extract request body
        const {name, email, password, phone} = req.body;

        // check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // upload profile image to cloudinary if file is provided
        let cloudinaryResult = null;
        if (req.file) {
            cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
        }

        // hash password
        const salRounds = 10;
        const hashPassword = await bcrypt.hash(password, salRounds);

        // create new user document
        const newUser = new User({
            name,
            email,
            password: hashPassword,
            phone,
            image: cloudinaryResult ? cloudinaryResult.secure_url : undefined,
            cloudinary_id: cloudinaryResult ? cloudinaryResult.public_id : undefined,
        });

        // save new user
        await newUser.save();

        // create JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).send({ message: 'User registered successfully', user:newUser , token });
    } catch (error) {
        res.status(500).send({ message:"can 't register user"})
    }
}

// ---------------- LOGIN USER ----------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ message: 'Invalid email or password' });

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ message: 'Invalid email or password' });

    // check completed courses automatically
    const assignedCourses = await Course.find({ assignedTo: user._id }).populate("lessons");
    for (const course of assignedCourses) {
      const allLessonsDone = course.lessons.every(l =>
        user.completedLessons.includes(l._id.toString())
      );
      if (allLessonsDone && !user.completedCourses.includes(course._id)) {
        user.completedCourses.push(course._id);
      }
    }
    await user.save();

    // create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).send({ message: 'User logged in successfully', user, token });
  } catch (error) {
    res.status(500).send({ message: "can't login user" });
  }
};

// ---------------- UPDATE USER ----------------
exports.updateUser = async (req, res) => {
    try {
        // check if logged user updates his own profile
        if (req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ message: "You are not authorized to update this user." });
        }

        const { id } = req.params; // user id to update
        const { name, email, phone, password } = req.body;

        // find user
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // upload new image if provided
        if (req.file) {
            // delete old image if exists
            if (user.cloudinary_id) {
                await cloudinary.uploader.destroy(user.cloudinary_id);
            }
            const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
            user.image = cloudinaryResult.secure_url;
            user.cloudinary_id = cloudinaryResult.public_id;
        }

        // update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;

        // hash password if provided
        if (password && password.trim() !== "") {
            const saltRounds = 10;
            user.password = await bcrypt.hash(password, saltRounds);
        }

        // save changes
        await user.save();

        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Can't update user" });
    }
};

// ---------------- GET SINGLE USER ----------------
exports.getUser = async (req, res) => {
  try {
    // do not send password field
    const user = await User.findById(req.params.id).select('-password'); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------- MARK QUIZ COMPLETED ----------------
exports.markQuizCompleted = async (req, res) => {
  try {
    const userId = req.user._id;
    const { quizId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // check if quiz already completed
    if (user.completedQuizzes.includes(quizId)) {
      return res.status(400).json({ message: "Quiz déjà complété" });
    }

    // add quiz to completed list
    user.completedQuizzes.push(quizId);

    // check if assigned courses are completed
    const assignedCourses = await Course.find({ assignedTo: user._id }).populate({
      path: 'lessons',
      populate: { path: 'quiz' } 
    });

    for (const course of assignedCourses) {
      const allLessonsDone = course.lessons.every(lesson =>
        user.completedLessons.includes(lesson._id.toString())
      );

      const allQuizzesDone = course.lessons.every(lesson => {
        if (!lesson.quiz || lesson.quiz.length === 0) return true;
        const quizzes = Array.isArray(lesson.quiz) ? lesson.quiz : [lesson.quiz];
        return quizzes.every(qId => user.completedQuizzes.includes(qId.toString()));
      });

      if (allLessonsDone && allQuizzesDone && !user.completedCourses.includes(course._id)) {
        user.completedCourses.push(course._id);
      }
    }

    await user.save();

    res.status(200).json({
      message: "Quiz complété avec succès",
      completedQuizzes: user.completedQuizzes,
      completedCourses: user.completedCourses
    });

  } catch (error) {
    console.error("Erreur markQuizCompleted:", error);
    res.status(500).json({ message: error.message });
  }
};

// ---------------- MARK LESSON COMPLETED ----------------
exports.completeLesson = async (req, res) => {
  try {
    const userId = req.user._id;
    const { lessonId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // check if lesson already completed
    if (user.completedLessons.includes(lessonId)) {
      return res.status(400).json({ message: "Lesson déjà complétée" });
    }

    // add lesson to completed list
    user.completedLessons.push(lessonId);

    // check if assigned courses are completed
    const assignedCourses = await Course.find({ assignedTo: user._id }).populate("lessons");
    for (const course of assignedCourses) {
      const allLessonsDone = course.lessons.every(l =>
        user.completedLessons.includes(l._id.toString())
      );
      if (allLessonsDone && !user.completedCourses.includes(course._id)) {
        user.completedCourses.push(course._id);
      }
    }

    await user.save();

    res.status(200).json({ 
      message: "Lesson marquée comme complétée", 
      completedLessons: user.completedLessons,
      completedCourses: user.completedCourses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- GET ALL USERS (WITHOUT ADMINS) ----------------
exports.getAllUsers = async (req, res) => {
  try {
    // get all users except admins
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");

    // calculate progress for each user
    const usersWithProgress = await Promise.all(
      users.map(async (user) => {
        const assignedCourses = await Course.find({ assignedTo: user._id }).populate({
          path: "lessons",
          populate: { path: "quiz" } 
        });

        let completedCourses = 0;
        let totalLessons = 0;
        let completedLessons = 0;
        let totalQuizzes = 0;
        let completedQuizzes = 0;

        assignedCourses.forEach(course => {
          const lessons = course.lessons || [];

          totalLessons += lessons.length;
          completedLessons += lessons.filter(l => user.completedLessons.includes(l._id.toString())).length;

          const quizzesInCourse = lessons.flatMap(lesson => {
            if (!lesson.quiz) return [];
            const quizzes = Array.isArray(lesson.quiz) ? lesson.quiz : [lesson.quiz];
            return quizzes;
          });

          totalQuizzes += quizzesInCourse.length;
          completedQuizzes += quizzesInCourse.filter(qId => user.completedQuizzes.includes(qId.toString())).length;

          // mark course completed if all lessons and quizzes done
          const allLessonsDone = lessons.every(l => user.completedLessons.includes(l._id.toString()));
          const allQuizzesDone = quizzesInCourse.every(qId => user.completedQuizzes.includes(qId.toString()));

          if (allLessonsDone && allQuizzesDone) completedCourses++;
        });

        return {
          ...user.toObject(),
          courses: { completed: completedCourses, total: assignedCourses.length },
          lessons: { completed: completedLessons, total: totalLessons },
          quizzes: { completed: completedQuizzes, total: totalQuizzes }
        };
      })
    );

    res.status(200).json(usersWithProgress);

  } catch (error) {
    console.error("Erreur dans getAllUsers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- DELETE USER ----------------
exports.deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params._id; // user id to delete
    const currentUser = req.user; // logged-in user

    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // only admin or same user can delete
    if (currentUser._id.toString() !== userIdToDelete && currentUser.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this user" });
    }

    // delete user
    const deletedUser = await User.findByIdAndDelete(userIdToDelete);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Cannot delete user" });
  }
};

// ---------------- GET USER PROGRESS ----------------
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.params.userId || req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // find assigned courses
    const assignedCourses = await Course.find({ assignedTo: userId }).populate("lessons");

    let totalLessons = 0, completedLessons = 0;
    let totalQuizzes = 0, completedQuizzes = 0;

    // count lessons
    assignedCourses.forEach(course => {
      const lessons = course.lessons || [];
      totalLessons += lessons.length;
      completedLessons += lessons.filter(l => user.completedLessons.includes(l._id.toString())).length;
    });

    // count quizzes
    const lessonIds = assignedCourses.flatMap(c => c.lessons.map(l => l._id));
    const quizzes = await Quiz.find({ lessonId: { $in: lessonIds } });
    totalQuizzes = quizzes.length;
    completedQuizzes = quizzes.filter(q => user.completedQuizzes.includes(q._id.toString())).length;

    const progress = {
      courses: { total: assignedCourses.length, completed: user.completedCourses.length },
      lessons: { total: totalLessons, completed: completedLessons },
      quizzes: { total: totalQuizzes, completed: completedQuizzes }
    };

    res.status(200).json({ userId, progress });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
