import React from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LessonCard = ({ lesson, course, listLessons, index, user, isDisabled }) => {
  const navigate = useNavigate();

  return (
    <Card style={{ width: "18rem", marginBottom: "1rem" }}>
      <Card.Body>
        <Card.Title>{lesson.title}</Card.Title>
        <Button
          variant="primary"
          onClick={() =>
            navigate(`/lesson/${lesson._id}`, {
              state: { courseId: course._id, lessons: listLessons },
            })
          }
          disabled={isDisabled}
        >
          Voir Lesson
        </Button>
      </Card.Body>
    </Card>
  );
};

export default LessonCard;
