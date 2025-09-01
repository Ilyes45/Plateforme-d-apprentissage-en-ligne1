import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './QuizCard.css'; // 🔹 CSS séparé pour le style du composant

// 🔹 Composant pour afficher un quiz individuel sous forme de carte
const QuizCard = ({ quiz, lessonsList, courseId, currentLessonId }) => {
  const navigate = useNavigate(); // 🔹 Hook pour naviguer programmatique

  return (
    <Card style={{ width: '18rem', marginBottom: '1rem' }}>
      <Card.Body>
        {/* 🔹 Titre indiquant la leçon associée */}
        <Card.Title>Quiz sur la leçon {quiz.lessonId}</Card.Title>

        {/* 🔹 Affiche le nombre de questions dans le quiz */}
        <Card.Text>Nombre de questions : {quiz.questions.length}</Card.Text>

        {/* 🔹 Bouton pour naviguer vers la page du quiz */}
        <Button
          variant="primary"
          onClick={() =>
            navigate(`/quiz/${quiz._id}`, {   // 🔹 Redirection vers le quiz
              state: {                       // 🔹 Passage de données via state
                lessons: lessonsList,
                courseId: courseId,
                currentLessonId: currentLessonId
              }
            })
          }
        >
          Voir Quiz
        </Button>
      </Card.Body>
    </Card>
  );
};

export default QuizCard;
