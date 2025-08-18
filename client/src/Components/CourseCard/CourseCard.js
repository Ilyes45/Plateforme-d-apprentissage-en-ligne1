import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteCourse } from '../../JS/Actions/course';
import './CourseCard.css';

const CourseCard = ({ course }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.userReducer.user);

  const handleViewLessons = () => {
    if (user) {
      navigate(`/course/${course._id}/lessons`);
    } else {
      alert("Tu dois t'inscrire ou te connecter pour accéder aux lessons !");
      navigate('/register'); // ou '/login'
    }
  };

  return (
    <div className="course-card-container">
      <Card className="h-100">
        <Card.Body>
          <Card.Title>{course.title}</Card.Title>
          <Card.Text>{course.description}</Card.Text>
          <Card.Text>{course.category}</Card.Text>

          <div className="d-flex flex-wrap gap-2 mt-3">
            <Button variant="primary" onClick={handleViewLessons}>
              Voir Lesson
            </Button>

            {user && user._id === course.createdBy && (
              <>
                <Button
                  variant="success"
                  onClick={() => navigate(`/add-lesson/${course._id}`)}
                >
                  Add Lesson
                </Button>
                <Button
                  variant="warning"
                  onClick={() => navigate(`/edit/${course._id}`)}
                >
                  Edit Course
                </Button>
                <Button
                  variant="danger"
                  onClick={() => dispatch(deleteCourse(course._id))}
                >
                  Delete Course
                </Button>
              </>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CourseCard;
