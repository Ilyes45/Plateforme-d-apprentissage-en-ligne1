import React from "react";
import { Button, Card, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteLesson, getLessons } from "../../JS/Actions/lesson"; 
import "./LessonCard.css";

const LessonCard = ({ lesson, course, listLessons, user, isDisabled }) => {
  const navigate = useNavigate(); // 🔹 Pour la navigation programmatique
  const dispatch = useDispatch(); // 🔹 Pour dispatcher les actions Redux

  // 🔹 Vérifie si la leçon est complétée pour un utilisateur standard
  const isCompleted = user?.role !== "admin" && user?.completedLessons?.includes(lesson._id);

  // 🔹 Supprimer la leçon et rafraîchir la liste
  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer cette leçon et ses quiz ?")) {
      dispatch(deleteLesson(lesson._id, course._id))
        .then(() => dispatch(getLessons(course._id))); // 🔹 Recharger les leçons après suppression
    }
  };

  return (
    <Card className="lesson-card">
      <Card.Body>
        <Card.Title>
          {lesson.title} 
          {isCompleted && <Badge bg="success">Completed ✅</Badge>} {/* 🔹 Badge vert si la leçon est complétée */}
        </Card.Title>

        {/* 🔹 Bouton voir la leçon */}
        <Button
          variant={isDisabled && user?.role !== "admin" ? "secondary" : "primary"} // 🔹 Bouton gris si verrouillé
          onClick={() =>
            !(isDisabled && user?.role !== "admin") &&
            navigate(`/lesson/${lesson._id}`, {
              state: { courseId: course._id, lessons: listLessons }, // 🔹 Passe les infos pour le composant cible
            })
          }
          disabled={isDisabled && user?.role !== "admin"} // 🔹 Désactive le bouton si verrouillé
        >
          {isDisabled && user?.role !== "admin" ? "Verrouillée" : "View Lessons"}
        </Button>

        {/* 🔹 Boutons admin */}
        {user?.role === "admin" && (
          <div className="button-group" style={{ marginTop: "10px" }}>
            <Button
              variant="warning"
              className="m-1"
              onClick={() =>
                navigate(`/edit-lesson/${lesson._id}`, {
                  state: { courseId: course._id, lessons: listLessons }, // 🔹 Pour pré-remplir le formulaire
                })
              }
            >
              Edit
            </Button>

            <Button
              variant="danger"
              className="m-1"
              onClick={handleDelete} // 🔹 Supprime la leçon
            >
              Delete
            </Button>

            <Button
              variant="success"
              className="m-1"
              onClick={() =>
                navigate(`/course/${course._id}/lesson/${lesson._id}/addquiz`, {
                  state: { lessons: listLessons }, // 🔹 Passe les leçons pour l'ajout de quiz
                })
              }
            >
              Add Quiz
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default LessonCard;
