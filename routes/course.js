const express = require('express');
const isauth = require('../midlleware/isAuth');
const { createCourse, getAllCourses, getOneCourse, deleteCourse, editCourse } = require('../controllers/course');
const isAdmin = require('../midlleware/isAdmin');

// cerate router
const router = express.Router();


// route course (create-course && get-courses && get-course-by-id) 

// add course

router.post("/addcourse",isauth, isAdmin, createCourse);

//get all course
router.get("/getCourses",getAllCourses);

// get one course
router.get("/:id",getOneCourse);

// delete course
router.delete("/:_id",isauth, isAdmin ,deleteCourse);

// edit course
router.put("/:_id",isauth, isAdmin ,editCourse);

//3- export router
module.exports = router;