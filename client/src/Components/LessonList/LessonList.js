import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getLessons } from '../../JS/Actions/lesson';
import LessonCard from '../LessonCard/LessonCard';  // Import du composant LessonCard
import { Spinner, Alert, Button } from 'react-bootstrap';

const LessonList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { courseId } = useParams();

  const { listLessons, load, error } = useSelector(state => state.lessonReducer);
  const listCourses = useSelector(state => state.courseReducer.listCourses); // récupère les cours
  const course = listCourses.find(c => c._id === courseId); // récupère le cours actuel

  useEffect(() => {
    if (courseId) {
      console.log("courseId:", courseId);
      dispatch(getLessons(courseId));
    }
  }, [dispatch, courseId]);

  if (load) return <Spinner animation="border" variant="primary" />;

  if (error)
    return (
      <Alert variant="danger">
        Erreur lors du chargement des leçons : {error.data?.message || error.message || 'Erreur inconnue'}
      </Alert>
    );

  if (!listLessons || listLessons.length === 0) {
    return <p>Aucune leçon trouvée pour ce cours.</p>;
  }

  return (
    <div className="row">
      {listLessons.map((lesson) => (
        <div key={lesson._id} className="col-md-4">
          <LessonCard lesson={lesson} course={course} listLessons={listLessons} />
        </div>
      ))}
      <Button variant="secondary" onClick={() => navigate('/cours')}>
  Retour aux cours
</Button>
    </div>
  );
};

export default LessonList;
