import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getQuiz, completeQuiz, getQuizzes } from "../../JS/Actions/quiz";
import './Quiz.css';

const Quiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { quizToGet, load } = useSelector((state) => state.quizReducer);
  const { user } = useSelector((state) => state.userReducer);

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

  if (load || !quizToGet) return <p>Chargement du quiz...</p>;
  if (!quizToGet.questions || quizToGet.questions.length === 0) return <p>Ce quiz ne contient aucune question.</p>;

  const currentQuestion = quizToGet.questions[currentQuestionIndex];

  const handleOptionChange = (option) => {
    const updated = [...answers];
    updated[currentQuestionIndex] = option;
    setAnswers(updated);
  };

  const handleQuizFinish = async () => {
    setQuizFinished(true);

    if (user && quizToGet._id) {
      const result = await dispatch(completeQuiz(quizToGet._id));
      if (result?.completedQuizzes) {
        user.completedQuizzes = result.completedQuizzes;
      }
      dispatch(getQuizzes(currentLessonId));
    }
  };

  const handleSubmit = () => {
    if (answers[currentQuestionIndex] === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex + 1 < quizToGet.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleQuizFinish();
    }
  };

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