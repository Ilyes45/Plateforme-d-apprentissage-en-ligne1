const User = require("../models/Users");
const Course = require("../models/Course");
const Quiz = require("../models/Quiz");
// require bcrypt
const bcrypt = require('bcrypt');
//require jsonwebtoken 
const jwt = require('jsonwebtoken');
// require cloudinary 
const cloudinary = require("../utils/cloudinary");

exports.register = async(req, res) => {
    try {
   
        //req.body
       
       
        const {name, email, password,phone} = req.body;
       // Vérifie si l'email existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
// Upload image sur Cloudinary si fichier présent
    let cloudinaryResult = null;
    if (req.file) {
      cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
    }


        const salRounds = 10;
        const hashPassword = await bcrypt.hash(password,salRounds);

        

         //create new user
        const newUser = new User({
            name,
            email,
            password: hashPassword,
            phone,
           image: cloudinaryResult ? cloudinaryResult.secure_url : undefined,
      cloudinary_id: cloudinaryResult ? cloudinaryResult.public_id : undefined,
        });
        
         //save user
        await newUser.save();

        //creation token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).send({ message: 'User registered successfully', user:newUser , token });
    } catch (error) {
        res.status(500).send({ message:"can 't register user"})
    }
}
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ message: 'Invalid email or password' });

    // 🔹 Calcul automatique des cours complets
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).send({ message: 'User logged in successfully', user, token });
  } catch (error) {
    res.status(500).send({ message: "can't login user" });
  }
};

   
exports.updateUser = async (req, res) => {
    try {
        // Vérifier que l'utilisateur connecté modifie bien son propre profil
        if (req.user._id.toString() !== req.params.id) {
   return res.status(403).json({ message: "You are not authorized to update this user." });
}


        const { id } = req.params; // id de l'utilisateur à modifier
        const { name, email, phone, password } = req.body;

        // Chercher l'utilisateur
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Upload image si nouvelle image fournie
        if (req.file) {
            // supprimer ancienne image si elle existe
            if (user.cloudinary_id) {
                await cloudinary.uploader.destroy(user.cloudinary_id);
            }
            const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
            user.image = cloudinaryResult.secure_url;
            user.cloudinary_id = cloudinaryResult.public_id;
        }

        // Mise à jour des champs
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;

        // Si mot de passe fourni, le hacher
        if (password && password.trim() !== "") {
            const saltRounds = 10;
            user.password = await bcrypt.hash(password, saltRounds);
        }

        // Sauvegarde
        await user.save();

        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Can't update user" });
    }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // ne pas renvoyer le mdp
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Marquer un quiz comme complété
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

    // 🔹 Vérifier si les cours sont complétés
    const assignedCourses = await Course.find({ assignedTo: user._id }).populate({
      path: 'lessons',
      populate: { path: 'quiz' } // on populate les quiz dans les leçons
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


// Marquer un quiz comme complété
// Marquer une leçon comme complétée
// Marquer une leçon comme complétée
exports.completeLesson = async (req, res) => {
  try {
    const userId = req.user._id;
    const { lessonId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    if (user.completedLessons.includes(lessonId)) {
      return res.status(400).json({ message: "Lesson déjà complétée" });
    }

    user.completedLessons.push(lessonId);

    // 🔹 Vérifier si les cours sont complétés
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



exports.getAllUsers = async (req, res) => {
  try {
    // Récupère tous les utilisateurs sauf les admins
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");

    const usersWithProgress = await Promise.all(
      users.map(async (user) => {
        // Cours assignés à l'utilisateur
        const assignedCourses = await Course.find({ assignedTo: user._id }).populate({
          path: "lessons",
          populate: { path: "quiz" } // populate les quizzes
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

          // Cours complété si toutes les leçons ET tous les quizzes complétés
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




// delete user (admin or self)
exports.deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params._id; // id du user à supprimer
    const currentUser = req.user; // utilisateur connecté

    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Vérifie si l'utilisateur est admin ou supprime son propre compte
    if (currentUser._id.toString() !== userIdToDelete && !currentUser.isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this user" });
    }

    // Supprime l'utilisateur
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
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.params.userId || req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const assignedCourses = await Course.find({ assignedTo: userId }).populate("lessons");

    let totalLessons = 0, completedLessons = 0;
    let totalQuizzes = 0, completedQuizzes = 0;

    assignedCourses.forEach(course => {
      const lessons = course.lessons || [];
      totalLessons += lessons.length;
      completedLessons += lessons.filter(l => user.completedLessons.includes(l._id.toString())).length;
    });

    // Récupérer tous les quizzes liés aux leçons
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