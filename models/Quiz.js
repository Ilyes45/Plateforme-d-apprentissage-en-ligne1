const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const questionSchema = new Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

const quizSchema = new Schema(
  {
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true }, // ✅ Ajouté
    questions: [questionSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = model("Quiz", quizSchema);
