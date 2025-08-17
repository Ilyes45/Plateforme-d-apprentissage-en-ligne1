import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getQuiz } from "../../JS/Actions/quiz";

const Quiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { quizToGet, load } = useSelector((state) => state.quizReducer);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const lessonsList = location.state?.lessons || [];
  const courseId = location.state?.courseId;
  const currentLessonId = location.state?.currentLessonId;

  const currentIndex = lessonsList.findIndex(
    (lesson) => String(lesson._id) === String(currentLessonId)
  );
  const nextLessonId =
    currentIndex >= 0 && currentIndex < lessonsList.length - 1
      ? lessonsList[currentIndex + 1]._id
      : null;

  useEffect(() => {
    dispatch(getQuiz(quizId));
  }, [dispatch, quizId]);

  // Si les données ne sont pas encore chargées, on affiche un message de chargement
  if (load || !quizToGet) return <p>Chargement du quiz...</p>;

  // Sécurité : si le quiz n’a pas de questions
  if (!quizToGet.questions || quizToGet.questions.length === 0) {
    return <p>Ce quiz ne contient aucune question.</p>;
  }

  const currentQuestion = quizToGet.questions[currentQuestionIndex];

  const handleOptionChange = (option) => {
    const updated = [...answers];
    updated[currentQuestionIndex] = option;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    if (answers[currentQuestionIndex] === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex + 1 < quizToGet.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  if (quizFinished) {
    return (
      <div className="container">
        <h2>Quiz terminé !</h2>
        <h3>
          Score final : {score} / {quizToGet.questions.length}
        </h3>
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
    );
  }

  return (
    <div className="container">
      <h2>{quizToGet.title || "Titre du quiz"}</h2>
      <div className="mb-3">
        <h5>
          Question {currentQuestionIndex + 1} : {currentQuestion.questionText}
        </h5>
        {currentQuestion.options.map((opt, i) => (
          <label key={i} style={{ display: "block" }}>
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
      <button onClick={handleSubmit}>Soumettre</button>
    </div>
  );
};

export default Quiz;
