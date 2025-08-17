// 1 - Require mongoose
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// 2 - Create schema
const questionSchema = new Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }
});

const quizSchema = new Schema({
  lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
  questions: [questionSchema]
}, { timestamps: true });

// 3 - Create model
const Quiz = model('Quiz', quizSchema);

// 4 - Export model
module.exports = Quiz;
