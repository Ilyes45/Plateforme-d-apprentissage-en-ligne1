const User = require("../models/Users");
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
        if (!user) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }
        //creation token
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).send({ message: 'User logged in successfully', user , token });
    } catch (error) {
        res.status(500).send({ message: "can't login user" });
    }
}
   
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
    await user.save();

    res.status(200).json({ 
      message: "Quiz complété avec succès", 
      completedQuizzes: user.completedQuizzes 
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
    await user.save();

    res.status(200).json({ 
      message: "Lesson marquée comme complétée", 
      completedLessons: user.completedLessons 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur dans getAllUsers:", error); // 👈 ajoute ça
    res.status(500).json({ message: "Server error" });
  }
};
