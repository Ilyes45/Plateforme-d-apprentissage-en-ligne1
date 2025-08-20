import React from "react";
import { Button, Card, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteLesson, getLessons } from "../../JS/Actions/lesson"; // 👈 importer ton action
import "./LessonCard.css";

const LessonCard = ({ lesson, course, listLessons, user, isDisabled }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isCompleted = user?.completedLessons?.includes(lesson._id);

  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer cette leçon ?")) {
      dispatch(deleteLesson(lesson._id)) // 👈 suppression
        .then(() => {
          // recharge les leçons de ce cours
          dispatch(getLessons(course._id));
        });
    }
  };

  return (
    <Card className="lesson-card">
      <Card.Body>
        <Card.Title>
          {lesson.title} {isCompleted && <Badge bg="success">✅ Terminé</Badge>}
        </Card.Title>

        <Button
          variant={isDisabled ? "secondary" : "primary"}
          onClick={() =>
            !isDisabled &&
            navigate(`/lesson/${lesson._id}`, {
              state: { courseId: course._id, lessons: listLessons },
            })
          }
          disabled={isDisabled}
        >
          {isDisabled ? "Verrouillée" : "Voir Leçon"}
        </Button>

        {user?.role === "admin" && (
          <div className="button-group">
            <Button
              variant="warning"
              onClick={() =>
                navigate(`/edit-lesson/${lesson._id}`, {
                  state: { courseId: course._id, lessons: listLessons },
                })
              }
            >
              Éditer
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Supprimer
            </Button>
            <Button
              variant="success"
              onClick={() =>
                navigate(`/course/${course._id}/lesson/${lesson._id}/addquiz`, {
                  state: { lessons: listLessons },
                })
              }
            >
              Ajouter Quiz
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default LessonCard;
