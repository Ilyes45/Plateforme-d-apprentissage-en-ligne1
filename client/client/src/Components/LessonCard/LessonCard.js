import { Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteLesson } from "../../JS/Actions/lesson";

const LessonCard = ({ lesson, course , listLessons }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Récupération de l'utilisateur connecté depuis Redux
  const user = useSelector((state) => state.userReducer.user);

  // L'utilisateur est propriétaire s'il est admin OU s'il a créé le cours
  const isOwner =
    user &&
    (user.role === "admin" || course?.createdBy?.toString() === user._id);

  console.log("User dans LessonCard :", user);
  console.log("Course dans LessonCard :", course);
  console.log("isOwner :", isOwner);
console.log("User:", user);
console.log("Role:", user?.role);
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>{lesson.title}</Card.Title>

        {/* Bouton pour voir la leçon */}
        <Button
  variant="primary"
  onClick={() => navigate(`/lesson/${lesson._id}`, { state: { courseId: course._id, lessons: listLessons } })}
>
  Voir Lesson
</Button>


        {/* Boutons d'édition uniquement si admin ou créateur */}
        {isOwner && (
          <>
            <Button
              variant="danger"
              onClick={() => dispatch(deleteLesson(lesson._id))}
            >
              Delete Lesson
            </Button>
            <Button
              variant="warning"
              onClick={() => navigate(`/edit-lesson/${lesson._id}`)}
            >
              Edit Lesson
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default LessonCard;
