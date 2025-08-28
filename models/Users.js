// 1 - Require mongoose
const mongoose = require('mongoose');

// 2 - Create schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  cloudinary_id: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  completedQuizzes: [{ // Quiz déjà validés
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  completedLessons: [{ // Leçons déjà validées
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  completedCourses: [{ // Cours déjà validés
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
});

// 3 - Create model
const User = mongoose.model('User', userSchema);

// 4 - Export model
module.exports = User;
