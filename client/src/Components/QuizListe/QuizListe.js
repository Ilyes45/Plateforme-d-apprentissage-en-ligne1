import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getQuizzes } from '../../JS/Actions/quiz';
import { Spinner, Alert } from 'react-bootstrap';
import QuizCard from '../QuizCard/QuizCard';
import './QuizListe.css';

const QuizListe = ({ lessonId, lessonsList, courseId }) => {
  const dispatch = useDispatch();

  const listQuizzes = useSelector(state => state.quizReducer.listQuizzes);
  const load = useSelector(state => state.quizReducer.load);
  const error = useSelector(state => state.quizReducer.error);

  useEffect(() => {
    if (lessonId) dispatch(getQuizzes(lessonId));
  }, [dispatch, lessonId]);

  if (load) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error.message || 'Erreur'}</Alert>;
  if (!listQuizzes || listQuizzes.length === 0) return <p>Aucun quiz trouvé</p>;

  return (
    <div>
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
