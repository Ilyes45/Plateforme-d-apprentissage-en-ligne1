import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const QuizCard = ({ quiz, lessonsList, courseId, currentLessonId }) => {
  const navigate = useNavigate();

  return (
    <Card style={{ width: '18rem', marginBottom: '1rem' }}>
      <Card.Body>
        <Card.Title>Quiz sur la leçon {quiz.lessonId}</Card.Title>
        <Card.Text>Nombre de questions : {quiz.questions.length}</Card.Text>
        <Button
          variant="primary"
          onClick={() =>
            navigate(`/quiz/${quiz._id}`, {
              state: {
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
