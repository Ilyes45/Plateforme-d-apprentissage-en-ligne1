import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getLesson } from '../../JS/Actions/lesson';
import ReactMarkdown from 'react-markdown';
import { Button } from 'react-bootstrap';

const LessonDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // courseId est passé via location.state quand on vient de LessonList ou LessonCard
  const courseId = location.state?.courseId;

  const { lessonToGet, load, error } = useSelector(state => state.lessonReducer);

  const lessonsList = location.state?.lessons || [];

  const currentIndex = lessonsList.findIndex(
    lesson => String(lesson._id) === String(id)
  );

  useEffect(() => {
    dispatch(getLesson(id));
  }, [dispatch, id]);

  if (load) return <p>Chargement de la leçon...</p>;
  if (error) return <p>Erreur : {error.message || error}</p>;
  if (!lessonToGet) return <p>Leçon non trouvée.</p>;

  const goPrevious = () => {
    if (currentIndex > 0) {
      const prevId = lessonsList[currentIndex - 1]._id;
      navigate(`/lesson/${prevId}`, { state: { lessons: lessonsList, courseId } });
    }
  };

  const goNext = () => {
    if (currentIndex < lessonsList.length - 1) {
      const nextId = lessonsList[currentIndex + 1]._id;
      navigate(`/lesson/${nextId}`, { state: { lessons: lessonsList, courseId } });
    }
  };

  return (
    <div key={id}>
      <h1><ReactMarkdown>{lessonToGet.title || 'Titre de la leçon'}</ReactMarkdown></h1>
      <ReactMarkdown>{lessonToGet.content || ''}</ReactMarkdown>

      <Button variant="secondary" onClick={goPrevious} disabled={currentIndex <= 0}>
        Précédent
      </Button>
      <Button variant="secondary" onClick={goNext} disabled={currentIndex === lessonsList.length - 1}>
        Suivant
      </Button>

      {/* Retour aux leçons du cours */}
      {courseId ? (
        <Button variant="primary" onClick={() => navigate(`/course/${courseId}/lessons`)}>
          Retour aux leçons
        </Button>
      ) : (
        <Button variant="primary" onClick={() => navigate('/cours')}>
          Retour aux cours
        </Button>
      )}
    </div>
  );
};

export default LessonDetails;
