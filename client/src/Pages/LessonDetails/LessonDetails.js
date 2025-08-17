import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getLesson } from "../../JS/Actions/lesson";
import { getQuizzes, deleteQuiz } from "../../JS/Actions/quiz";
import ReactMarkdown from "react-markdown";
import { Button, Spinner, Alert } from "react-bootstrap";

const LessonDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const courseId = location.state?.courseId;
  const lessonsList = location.state?.lessons || [];
  const currentIndex = lessonsList.findIndex(
    (lesson) => String(lesson._id) === String(id)
  );

  const { lessonToGet, load, error } = useSelector((state) => state.lessonReducer);
  const { listQuizzes, load: loadQuiz, error: errorQuiz } = useSelector(
    (state) => state.quizReducer
  );
  const { user } = useSelector((state) => state.userReducer);

  const [canGoNext, setCanGoNext] = useState(false);

  useEffect(() => {
    dispatch(getLesson(id));
    dispatch(getQuizzes(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!user) return;

    if (!listQuizzes || listQuizzes.length === 0) {
      setCanGoNext(true); // pas de quiz
    } else {
      const allCompleted = listQuizzes.every((quiz) =>
        user.completedQuizzes?.includes(quiz._id)
      );
      setCanGoNext(allCompleted);
    }
  }, [user, listQuizzes]);

  const goPrevious = () => {
    if (currentIndex > 0) {
      const prevId = lessonsList[currentIndex - 1]._id;
      navigate(`/lesson/${prevId}`, { state: { lessons: lessonsList, courseId } });
    }
  };

  const goNext = () => {
    if (!canGoNext) {
      alert("Vous devez terminer tous les quiz pour accéder à la leçon suivante.");
      return;
    }
    if (currentIndex < lessonsList.length - 1) {
      const nextId = lessonsList[currentIndex + 1]._id;
      navigate(`/lesson/${nextId}`, { state: { lessons: lessonsList, courseId } });
    } else {
      // dernière leçon terminée => revenir à la liste de leçons
      navigate(`/course/${courseId}/lessons`);
    }
  };

  if (load) return <p>Chargement de la leçon...</p>;
  if (error) return <p>Erreur : {error.message || error}</p>;
  if (!lessonToGet) return <p>Leçon non trouvée.</p>;

  return (
    <div key={id}>
      <h1><ReactMarkdown>{lessonToGet.title}</ReactMarkdown></h1>
      <ReactMarkdown>{lessonToGet.content}</ReactMarkdown>

      {/* Navigation */}
      <div className="mb-3">
        <Button variant="secondary" onClick={goPrevious} disabled={currentIndex <= 0}>
          Précédent
        </Button>{" "}
        <Button variant="secondary" onClick={goNext} disabled={currentIndex === lessonsList.length - 1 && !canGoNext}>
          Suivant
        </Button>
      </div>

      {/* Retour aux leçons */}
      <Button variant="primary" onClick={() => navigate(`/course/${courseId}/lessons`)}>
        Retour aux leçons
      </Button>

      <hr />

      {/* Quiz */}
      <h2>Quiz liés à cette leçon</h2>
      {loadQuiz ? (
        <Spinner animation="border" />
      ) : errorQuiz ? (
        <Alert variant="danger">{errorQuiz.message || "Erreur lors du chargement des quiz"}</Alert>
      ) : listQuizzes.length === 0 ? (
        <p>Aucun quiz trouvé</p>
      ) : (
        listQuizzes.map((quiz) => (
          <div key={quiz._id} style={{ marginBottom: "15px" }}>
            <h5>{quiz.title}</h5>
            <Button
              variant="success"
              onClick={() =>
                navigate(`/quiz/${quiz._id}`, {
                  state: { lessons: lessonsList, courseId, currentLessonId: id },
                })
              }
            >
              Voir Quiz
            </Button>{" "}
            {user?.role === "admin" && (
              <>
                <Button
                  variant="warning"
                  onClick={() =>
                    navigate(`/edit-quiz/${quiz._id}`, { state: { courseId, lessons: lessonsList } })
                  }
                >
                  Éditer
                </Button>{" "}
                <Button variant="danger" onClick={() => dispatch(deleteQuiz(quiz._id))}>
                  Supprimer
                </Button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default LessonDetails;
