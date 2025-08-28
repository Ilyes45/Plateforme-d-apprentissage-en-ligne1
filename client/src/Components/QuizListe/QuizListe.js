import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getQuizzes } from '../../JS/Actions/quiz';
import { Spinner, Alert } from 'react-bootstrap';
import QuizCard from '../QuizCard/QuizCard';
import './QuizListe.css';

const QuizListe = ({ lessonId, lessonsList, courseId }) => {
  const dispatch = useDispatch();

  const { listQuizzes, load, error } = useSelector(state => state.quizReducer);

  useEffect(() => {
    if (lessonId) dispatch(getQuizzes(lessonId));
  }, [dispatch, lessonId]);

  if (load) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error.message || 'Erreur lors du chargement des quizzes'}</Alert>;
  if (!listQuizzes || listQuizzes.length === 0) return <p>Aucun quiz trouvé</p>;

  return (
    <div className="quiz-list">
      {listQuizzes.map(quiz => (
        <QuizCard
          key={quiz._id}
          quiz={quiz}
          lessonsList={lessonsList}
          courseId={courseId}
          currentLessonId={lessonId}
        />
      ))}
    </div>
  );
};

export default QuizListe;
