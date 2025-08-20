const Course = require("../models/Course");



exports.createCourse = async (req, res) => {
    try {
  const { title, description, category} = req.body;
  const course = new Course({
    title,
    description,
    category,
    createdBy: req.user._id, 
  });
  await course.save();
 res.status(201).send({ message: 'couse created  successfully...', course });
    } catch (error) { 
        console.error(error); 
        res.status(500).send({ message:"can 't create course !!!!", error: error.message })
    }
}

exports.getAllCourses = async (req, res) => {
  try {
    let courses;
    if (req.user) {
      // utilisateur connecté : seulement les cours assignés
      courses = await Course.find({ assignedTo: req.user._id });
    } else {
      // non connecté : voir tous les cours
      courses = await Course.find();
    }
    res.status(200).send({ message: 'Courses retrieved successfully', courses });
  } catch (error) {
    res.status(500).send({ message: "Can't retrieve courses" });
  }
};



exports.getOneCourse = async(req,res)=>{
   try {
    const courseToGet = await Course.findOne({_id: req.params.id});
    res.status(200).send({msg:"i get the course ...",courseToGet});

   } catch (error) {
    console.error("Error in getOneCourse:", error); 
    res.status(400).send({msg:"can not get the course !!!",error: error.message})
   }
};


exports.deleteCourse = async (req, res) => {
  try {
    const { _id } = req.params;
    const deleted = await Course.findByIdAndDelete(_id);

    if (!deleted) {
      return res.status(404).send({ msg: "Course not found" });
    }

    res.status(200).send({ msg: "Course deleted successfully" });
  } catch (error) {
    res.status(400).send({ msg: "Cannot delete course", error });
  }
};


exports.editCourse = async (req, res) => {
  try {
    const { _id } = req.params;
    console.log("Update course id:", _id);
    console.log("Update data:", req.body);

    const result = await Course.findByIdAndUpdate(_id, req.body, { new: true });

    if (!result) {
      return res.status(404).send({ msg: "Course not found" });
    }

    res.status(200).send({ msg: "Course updated", course: result });
  } catch (error) {
    console.error(error);
    res.status(400).send({ msg: "Cannot update course", error });
  }
};

exports.assignCourseToUser = async (req, res) => {
  try {
    const { courseId, userId } = req.body; // admin envoie le cours + user
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: "Cours introuvable" });

    if (!course.assignedTo.includes(userId)) {
      course.assignedTo.push(userId);
      await course.save();
    }

    res.status(200).json({ msg: "Cours assigné à l'utilisateur", course });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};





