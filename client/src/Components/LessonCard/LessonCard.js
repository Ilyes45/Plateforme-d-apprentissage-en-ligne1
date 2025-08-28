import React from "react";
import { Button, Card, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteLesson, getLessons } from "../../JS/Actions/lesson"; // actions Redux
import "./LessonCard.css";

const LessonCard = ({ lesson, course, listLessons, user, isDisabled }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isCompleted = user?.completedLessons?.includes(lesson._id);

  // Suppression de la leçon avec tous ses quiz et mise à jour des utilisateurs
  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer cette leçon et ses quiz ?")) {
      dispatch(deleteLesson(lesson._id, course._id)) // envoie courseId pour recharger la liste
        .then(() => dispatch(getLessons(course._id)));
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
          <div className="button-group" style={{ marginTop: "10px" }}>
            <Button
              variant="warning"
              className="m-1"
              onClick={() =>
                navigate(`/edit-lesson/${lesson._id}`, {
                  state: { courseId: course._id, lessons: listLessons },
                })
              }
            >
              Éditer
            </Button>

            <Button
              variant="danger"
              className="m-1"
              onClick={handleDelete}
            >
              Supprimer
            </Button>

            <Button
              variant="success"
              className="m-1"
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
