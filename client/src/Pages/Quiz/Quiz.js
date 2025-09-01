import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getQuiz, completeQuiz, getQuizzes } from "../../JS/Actions/quiz";
import './Quiz.css';

const Quiz = () => {
  // 🔹 Récupération des paramètres URL
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // 🔹 Récupération du quiz et de l'utilisateur depuis Redux
  const { quizToGet, load } = useSelector((state) => state.quizReducer);
  const { user } = useSelector((state) => state.userReducer);

  // 🔹 états locaux
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // index question courante
  const [answers, setAnswers] = useState([]); // réponses choisies par l'utilisateur
  const [score, setScore] = useState(0); // score du quiz
  const [quizFinished, setQuizFinished] = useState(false); // état quiz terminé

  // 🔹 récupération de la liste des leçons et de la leçon courante depuis location.state
  const lessonsList = location.state?.lessons || [];
  const courseId = location.state?.courseId;
  const currentLessonId = location.state?.currentLessonId;

  // 🔹 calcul de la prochaine leçon
  const currentIndex = lessonsList.findIndex(
    (lesson) => String(lesson._id) === String(currentLessonId)
  );
  const nextLessonId =
    currentIndex >= 0 && currentIndex < lessonsList.length - 1
      ? lessonsList[currentIndex + 1]._id
      : null;

  // 🔹 chargement du quiz depuis l'API au montage
  useEffect(() => {
    dispatch(getQuiz(quizId));
  }, [dispatch, quizId]);

  // 🔹 gestion du chargement
  if (load || !quizToGet) return <p>Chargement du quiz...</p>;
  if (!quizToGet.questions || quizToGet.questions.length === 0) return <p>Ce quiz ne contient aucune question.</p>;

  // 🔹 question courante
  const currentQuestion = quizToGet.questions[currentQuestionIndex];

  // 🔹 sélection d'une option
  const handleOptionChange = (option) => {
    const updated = [...answers];
    updated[currentQuestionIndex] = option;
    setAnswers(updated);
  };

  // 🔹 fin du quiz
  const handleQuizFinish = async () => {
    setQuizFinished(true);

    if (user && quizToGet._id) {
      // 🔹 dispatch pour marquer le quiz comme complété
      const result = await dispatch(completeQuiz(quizToGet._id));
      if (result?.completedQuizzes) {
        user.completedQuizzes = result.completedQuizzes;
      }
      // 🔹 rafraîchir les quizzes pour la leçon
      dispatch(getQuizzes(currentLessonId));
    }
  };

  // 🔹 validation de la réponse et passage à la question suivante
  const handleSubmit = () => {
    if (answers[currentQuestionIndex] === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1); // incrémentation du score
    }

    if (currentQuestionIndex + 1 < quizToGet.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1); // prochaine question
    } else {
      handleQuizFinish(); // fin du quiz
    }
  };

  // 🔹 rendu quiz terminé
  if (quizFinished) {
    return (
      <div className="quiz-container">
        <h2>Quiz terminé !</h2>
        <h3>
          Score final : {score} / {quizToGet.questions.length}
        </h3>
        <div className="finished-buttons">
          {nextLessonId ? (
            <button
              onClick={() =>
                navigate(`/lesson/${nextLessonId}`, {
                  state: { lessons: lessonsList, courseId },
                })
              }
            >
              Passer à la leçon suivante
            </button>
          ) : (
            <button onClick={() => navigate(`/course/${courseId}/lessons`)}>
              Retour aux leçons
            </button>
          )}
        </div>
      </div>
    );
  }

  // 🔹 rendu question courante
  return (
    <div className="quiz-container">
      <div className="question-section">
        <h5>
          Question {currentQuestionIndex + 1} : {currentQuestion.questionText}
        </h5>
        {currentQuestion.options.map((opt, i) => (
          <label key={i} className="option-label">
            <input
              type="radio"
              name={`question-${currentQuestionIndex}`}
              value={opt}
              checked={answers[currentQuestionIndex] === opt}
              onChange={() => handleOptionChange(opt)}
            />
            {opt}
          </label>
        ))}
      </div>
      <button onClick={handleSubmit} className="quiz-button">Soumettre</button>
    </div>
  );
};

export default Quiz;
