import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getLesson } from "../../JS/Actions/lesson";
import { getQuizzes, deleteQuiz } from "../../JS/Actions/quiz";
import { completeLessonAction } from "../../JS/Actions/user";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button, Spinner, Alert } from "react-bootstrap";

// coloration syntaxique
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const LessonDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { lessonToGet, load, error } = useSelector(state => state.lessonReducer);
  const { listQuizzes, load: loadQuiz, error: errorQuiz } = useSelector(state => state.quizReducer);
  const { user } = useSelector(state => state.userReducer);
  const listCourses = useSelector(state => state.courseReducer.listCourses);

  const [lessonsList, setLessonsList] = useState([]);
  const [canGoNext, setCanGoNext] = useState(false);

  // récupération du cours et des leçons
  useEffect(() => {
    if (location.state?.lessons) {
      setLessonsList(location.state.lessons);
    } else if (listCourses && listCourses.length > 0) {
      const courseId = location.state?.courseId || lessonToGet?.courseId;
      const course = listCourses.find(c => c._id === courseId);
      if (course) setLessonsList(course.lessons || []);
    }
  }, [location.state, listCourses, lessonToGet]);

  const currentIndex = lessonsList.findIndex(
    lesson => String(lesson._id) === String(id)
  );

  // récupérer la leçon + quiz
  useEffect(() => {
    if (id) dispatch(getLesson(id));
    dispatch(getQuizzes(id));

    if (user && !user.completedLessons?.includes(id)) {
      dispatch(completeLessonAction(id));
    }
  }, [dispatch, id, user]);

  // vérifier si tous les quiz sont complétés
  useEffect(() => {
    if (!user) return;

    if (!listQuizzes || listQuizzes.length === 0) {
      setCanGoNext(true);
    } else {
      const allCompleted = listQuizzes.every(quiz =>
        user.completedQuizzes?.includes(quiz._id)
      );
      setCanGoNext(allCompleted);
    }
  }, [user, listQuizzes]);

  const goPrevious = () => {
    if (currentIndex > 0) {
      const prevId = lessonsList[currentIndex - 1]._id;
      navigate(`/lesson/${prevId}`, { state: { lessons: lessonsList, courseId: lessonToGet?.courseId } });
    }
  };

  const goNext = () => {
    if (!canGoNext) {
      alert("Vous devez terminer tous les quiz pour accéder à la leçon suivante.");
      return;
    }
    if (currentIndex < lessonsList.length - 1) {
      const nextId = lessonsList[currentIndex + 1]._id;
      navigate(`/lesson/${nextId}`, { state: { lessons: lessonsList, courseId: lessonToGet?.courseId } });
    } else {
      navigate(`/course/${lessonToGet?.courseId}/lessons`);
    }
  };

  if (load) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">Erreur : {error.message || "Leçon introuvable"}</Alert>;
  if (!lessonToGet) return <p>Leçon non trouvée.</p>;

  const cleanContent = (lessonToGet.content || "").replace(/^\s*[-*]\s*$/gm, "");

  return (
    <div className="lesson-details-container" key={id}>
      <h1>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {lessonToGet.title}
        </ReactMarkdown>
      </h1>

      <div className="lesson-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {cleanContent}
        </ReactMarkdown>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
        <Button variant="secondary" onClick={goPrevious} disabled={currentIndex <= 0}>
          Précédent
        </Button>
        <Button variant="secondary" onClick={goNext} disabled={currentIndex === lessonsList.length - 1 && !canGoNext}>
          Suivant
        </Button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}>
        <Button variant="primary" onClick={() => navigate(`/course/${lessonToGet.courseId}/lessons`)}>
          Retour aux leçons
        </Button>
      </div>

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
        listQuizzes.map(quiz => {
          const completed = user?.completedQuizzes?.includes(quiz._id);
          return (
            <div key={quiz._id} className="quiz-card" style={{ marginBottom: "20px" }}>
              <h5>{quiz.title || "Quiz"} {completed && "✅ Déjà complété"}</h5>
              <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                <Button
                  variant={completed ? "secondary" : "success"}
                  className="m-2"
                  disabled={completed}
                  onClick={() =>
                    navigate(`/quiz/${quiz._id}`, {
                      state: { lessons: lessonsList, courseId: lessonToGet.courseId, currentLessonId: id },
                    })
                  }
                >
                  {completed ? "Quiz complété" : "Voir Quiz"}
                </Button>

                {user?.role === "admin" && (
                  <>
                    <Button
                      variant="warning"
                      className="m-2"
                      onClick={() => navigate(`/edit-quiz/${quiz._id}`, { state: { lessons: lessonsList, courseId: lessonToGet.courseId } })}
                    >
                      Éditer
                    </Button>
                    <Button
                      variant="danger"
                      className="m-2"
                      onClick={() => dispatch(deleteQuiz(quiz._id))}
                    >
                      Supprimer
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default LessonDetails;
