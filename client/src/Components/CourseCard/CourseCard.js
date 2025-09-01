import React, { useEffect } from 'react';
import { Button, Card, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteCourse } from '../../JS/Actions/course';
import { getAllUsers } from '../../JS/Actions/user';
import './CourseCard.css';
import { SiCplusplus, SiPython, SiJavascript, SiHtml5, SiCss3, SiReact } from "react-icons/si";
import { FaJava, FaServer } from "react-icons/fa";

// 🔹 Mapping des icônes selon le titre du cours
const iconMap = {
  "C++": <SiCplusplus size={50} color="#00599C" />,
  "Python": <SiPython size={50} color="#306998" />,
  "JavaScript": <SiJavascript size={50} color="#f0db4f" />,
  "Java": <FaJava size={50} color="#007396" />,
  "HTML": <SiHtml5 size={50} color="#e34c26" />,
  "CSS": <SiCss3 size={50} color="#264de4" />,
  "React": <SiReact size={50} color="#61dafb" />,
  "Node.js": <FaServer size={50} color="#68A063" />,
};

const CourseCard = ({ course, isDisabled = false, completed, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 Récupération de l'utilisateur courant depuis le store
  const currentUser = useSelector(state => state.userReducer.user);

  // 🔹 Si l'utilisateur est admin, on récupère tous les utilisateurs
  useEffect(() => {
    if (currentUser && currentUser.role === "admin") dispatch(getAllUsers());
  }, [dispatch, currentUser]);

  // 🔹 Détermine si le cours est complété pour les utilisateurs non-admin
  const isCompleted = user?.role !== "admin" && (
    completed !== undefined
      ? completed
      : user?.completedLessons &&
        course?.lessons?.length > 0 &&
        course.lessons.every((l) => user.completedLessons.includes(l._id))
  );

  // 🔹 Gestion de la navigation vers les leçons
  const handleViewLessons = () => {
    if (isDisabled && user?.role !== "admin") return; // bloque si cours verrouillé
    if (user) navigate(`/course/${course._id}/lessons`);
    else {
      alert("Tu dois t'inscrire ou te connecter !");
      navigate('/register');
    }
  };

  // 🔹 Vérifie si l'utilisateur peut éditer le cours
  const canEdit = user && (user._id === course.createdBy._id || user.role === "admin");

  return (
    <div className="course-card-container">
      <Card className="h-100 position-relative">
        <Card.Body>
          {/* 🔹 Titre du cours avec icône + badge de complétion */}
          <Card.Title className="course-icon d-flex justify-content-between align-items-center">
            {iconMap[course.title] || course.title}
            {isCompleted && (
              <Badge bg="success" pill>
                Terminé ✅
              </Badge>
            )}
          </Card.Title>

          {/* 🔹 Description et catégorie */}
          <Card.Text>{course.description}</Card.Text>
          <Card.Text>{course.category}</Card.Text>

          {/* 🔹 Boutons d'action */}
          <div className="d-flex flex-wrap gap-2 mt-3">
            <Button
              variant={isDisabled && user?.role !== "admin" ? "secondary" : "primary"}
              onClick={handleViewLessons}
              disabled={isDisabled && user?.role !== "admin"}
            >
              {isDisabled && user?.role !== "admin" ? "Verrouillé 🔒" : "View Lessons"}
            </Button>

            {/* 🔹 Boutons admin / créateur */}
            {canEdit && (
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
