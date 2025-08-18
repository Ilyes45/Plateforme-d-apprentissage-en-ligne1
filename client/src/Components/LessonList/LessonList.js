import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLessons } from "../../JS/Actions/lesson";
import LessonCard from "../LessonCard/LessonCard";
import { Spinner, Alert, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import "./LessonList.css";

const LessonList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const { listLessons, load, error } = useSelector((state) => state.lessonReducer);
  const listCourses = useSelector((state) => state.courseReducer.listCourses);
  const user = useSelector((state) => state.userReducer.user);

  useEffect(() => {
    if (courseId) dispatch(getLessons(courseId));
  }, [dispatch, courseId]);

  if (!listCourses || listCourses.length === 0) return <p>Chargement des cours...</p>;
  const course = listCourses.find((c) => c._id === courseId);
  if (!course) return <p>Cours non trouvé...</p>;
  if (load) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">Erreur : {error.message || "Erreur inconnue"}</Alert>;
  if (!listLessons || listLessons.length === 0) return <p>Aucune leçon trouvée.</p>;

  return (
    <div className="lesson-list-container">
      <div className="lesson-grid">
        {listLessons.map((lesson, index) => {
          const isDisabled = index !== 0 && !user.completedLessons?.includes(listLessons[index - 1]._id);
          return (
            <LessonCard
              key={lesson._id}
              lesson={lesson}
              course={course}
              listLessons={listLessons}
              user={user}
              isDisabled={isDisabled}
            />
          );
        })}
      </div>

      {/* Bouton retour */}
      <div className="back-button">
        <Button variant="secondary" onClick={() => navigate("/cours")}>
          Retour aux cours
        </Button>
      </div>
    </div>
  );
};

export default LessonList;
