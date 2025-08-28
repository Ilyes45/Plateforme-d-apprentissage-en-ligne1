const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const lessonSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course" },
    quiz: { type: Schema.Types.ObjectId, ref: "Quiz" }, 
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = model("Lesson", lessonSchema);
