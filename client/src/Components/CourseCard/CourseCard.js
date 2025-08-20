import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteCourse } from '../../JS/Actions/course';
import './CourseCard.css';
import { SiCplusplus, SiPython, SiJavascript, SiHtml5, SiCss3, SiReact  } from "react-icons/si";
import { FaJava , FaServer  } from "react-icons/fa"; // Java depuis FontAwesome

const iconMap = {
  "C++": <SiCplusplus size={50} color="#00599C" />,
  "Python": <SiPython size={50} color="#306998" />,
  "JavaScript": <SiJavascript size={50} color="#f0db4f" />,
  "Java": <FaJava size={50} color="#007396" />, // utilisation de FontAwesome
  "HTML": <SiHtml5 size={50} color="#e34c26" />,
  "CSS": <SiCss3 size={50} color="#264de4" />,
  "React": <SiReact size={50} color="#61dafb" />,
  "Node.js": <FaServer size={50} color="#68A063" />, // Node.js génériqu
};


const CourseCard = ({ course }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.userReducer.user);

  const handleViewLessons = () => {
    if (user) {
      navigate(`/course/${course._id}/lessons`);
    } else {
      alert("Tu dois t'inscrire ou te connecter pour accéder aux lessons !");
      navigate('/register');
    }
  };

  return (
    <div className="course-card-container">
      <Card className="h-100">
        <Card.Body>
          {/* Icône dynamique ou titre si pas d'icône */}
          <Card.Title className="course-icon">
            {iconMap[course.title] || course.title}
          </Card.Title>
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
