//1- require mongoose
const mongoose = require('mongoose');


//2- create schema

const { Schema, model } = mongoose;


const lessonSchema = new Schema({
   title: { type: String, required: true },
  content: { type: String, required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course" },   
}, { timestamps: true });
//3- create model
const Lesson = model('Lesson', lessonSchema);

//4- export model
module.exports = Lesson;