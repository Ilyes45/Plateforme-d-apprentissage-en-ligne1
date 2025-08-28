const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }], // tableau de leçons
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: "User" }] // utilisateurs assignés
  },
  { timestamps: true }
);

module.exports = model("Course", courseSchema);
