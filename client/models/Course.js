//1- require mongoose
const mongoose = require('mongoose');


//2- create schema

const { Schema, model } = mongoose;


const courseSchema = new Schema({
   title: { type: String, required: true },          
  description: String,                              
  category: String,                                 
  lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }], 
  createdBy: { type: Schema.Types.ObjectId, ref: "User" }    
}, { timestamps: true });
//3- create model
const Course = model('Course', courseSchema);

//4- export model
module.exports = Course;
