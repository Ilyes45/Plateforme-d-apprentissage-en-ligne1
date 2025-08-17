const express = require('express');
const isauth = require('../midlleware/isAuth');
const isAdmin = require('../midlleware/isAdmin');
const { getAllLessons, createLesson, getOneLesson, deleteLesson, editLesson } = require('../controllers/lesson');

// cerate router
const router = express.Router();


// route lesson (create-lesson && get-lessons && get-lesson-by-id) 

// add lesson

router.post("/addlesson",isauth, isAdmin,createLesson );

//get all lesson
router.get("/getLessons",getAllLessons);

// get one lesson
router.get("/:id",getOneLesson);

// delete lesson
router.delete("/:_id",isauth, isAdmin ,deleteLesson);

// edit lesson
router.put("/:_id",isauth, isAdmin ,editLesson);

//3- export router
module.exports = router;