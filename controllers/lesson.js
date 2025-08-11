const Lesson = require("../models/Lesson");



exports.createLesson = async (req, res) => {
    try {
  const { title, content, videoUrl, courseId } = req.body;
  const lesson = new Lesson({
    title,
    content,
    videoUrl,
    courseId,
    createdBy: req.user._id,
  });
  await lesson.save();
 res.status(201).send({ message: 'lesson created  successfully...', lesson });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message:"can 't create lesson !!!!", error: error.message })
    }
}

exports.getAllLessons = async (req, res) => {
  try {
    const filter = {};
    if (req.query.courseId) {
      filter.courseId = req.query.courseId;
    }
    const lessons = await Lesson.find(filter);
    res.status(200).send({ message: 'Lessons retrieved successfully...', lessons });
  } catch (error) {
    res.status(500).send({ message: "Can't retrieve lessons !!!", error: error.message });
  }
};


exports.getOneLesson = async(req,res)=>{
   try {
    const lessonToGet = await Lesson.findOne({_id: req.params.id});
    res.status(200).send({msg:"i get the lesson ...",lessonToGet});

   } catch (error) {
    console.error("Error in getOneLesson:", error);
    res.status(400).send({msg:"can not get the lesson !!!",error: error.message})
   }
};


exports.deleteLesson = async (req, res) => {
  try {
    const { _id } = req.params;
    const deleted = await Lesson.findByIdAndDelete(_id);

    if (!deleted) {
      return res.status(404).send({ msg: "Lesson not found" });
    }

    res.status(200).send({ msg: "Lesson deleted successfully" });
  } catch (error) {
    res.status(400).send({ msg: "Cannot delete lesson", error });
  }
};


exports.editLesson = async (req, res) => {
  try {
    const { _id } = req.params;
    console.log("Update lesson id:", _id);
    console.log("Update data:", req.body);

    const result = await Lesson.findByIdAndUpdate(_id, req.body, { new: true });

    if (!result) {
      return res.status(404).send({ msg: "Lesson not found" });
    }

    res.status(200).send({ msg: "Lesson updated", lesson: result });
  } catch (error) {
    console.error(error);
    res.status(400).send({ msg: "Cannot update lesson", error });
  }
};




