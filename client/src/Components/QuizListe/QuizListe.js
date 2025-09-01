import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getQuizzes } from '../../JS/Actions/quiz';
import { Spinner, Alert } from 'react-bootstrap';
import QuizCard from '../QuizCard/QuizCard';
import './QuizListe.css';

// 🔹 Composant pour afficher la liste des quizzes d'une leçon spécifique
const QuizListe = ({ lessonId, lessonsList, courseId }) => {
  const dispatch = useDispatch();

  // 🔹 Récupérer l'état des quizzes depuis Redux
  const { listQuizzes, load, error } = useSelector(state => state.quizReducer);

  // 🔹 useEffect pour récupérer les quizzes lorsque lessonId change
  useEffect(() => {
    if (lessonId) dispatch(getQuizzes(lessonId));
  }, [dispatch, lessonId]);

  // 🔹 Affichage conditionnel pendant le chargement
  if (load) return <Spinner animation="border" variant="primary" />;

  // 🔹 Affichage conditionnel en cas d'erreur
  if (error) return <Alert variant="danger">{error.message || 'Erreur lors du chargement des quizzes'}</Alert>;

  // 🔹 Message si aucun quiz n'est trouvé
  if (!listQuizzes || listQuizzes.length === 0) return <p>Aucun quiz trouvé</p>;

  // 🔹 Affichage de la liste des QuizCard
  return (
    <div className="quiz-list">
      {listQuizzes.map(quiz => (
        <QuizCard
          key={quiz._id}                  // 🔹 clé unique pour React
          quiz={quiz}                      // 🔹 données du quiz
          lessonsList={lessonsList}        // 🔹 liste des leçons pour context
          courseId={courseId}              // 🔹 ID du cours parent
          currentLessonId={lessonId}       // 🔹 ID de la leçon courante
        />
      ))}
    </div>
  );
};

export default QuizListe;
