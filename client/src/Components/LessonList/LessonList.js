import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // 🔹 Pour dispatcher les actions et accéder au store Redux
import { getLessons } from "../../JS/Actions/lesson"; // 🔹 Action pour récupérer les leçons
import LessonCard from "../LessonCard/LessonCard"; // 🔹 Composant enfant pour afficher chaque leçon
import { Spinner, Button } from "react-bootstrap"; // 🔹 Composants UI Bootstrap
import { useParams, useNavigate } from "react-router-dom"; // 🔹 Pour récupérer params URL et navigation
import "./LessonList.css"; // 🔹 Styles spécifiques au composant

const LessonList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams(); // 🔹 Récupère l'ID du cours depuis l'URL

  const { listLessons, load } = useSelector((state) => state.lessonReducer); // 🔹 Liste des leçons et état de chargement
  const listCourses = useSelector((state) => state.courseReducer.listCourses); // 🔹 Tous les cours
  const user = useSelector((state) => state.userReducer.user); // 🔹 Utilisateur courant

  // 🔹 Charger les leçons à l'affichage du composant ou quand courseId change
  useEffect(() => {
    if (courseId) dispatch(getLessons(courseId));
  }, [dispatch, courseId]);

  // 🔹 Gestion des cas où les cours ne sont pas encore chargés
  if (!listCourses || listCourses.length === 0) return <p>Chargement des cours...</p>;
  const course = listCourses.find((c) => c._id === courseId);
  if (!course) return <p>Cours non trouvé...</p>;
  
  // 🔹 Affichage spinner pendant le chargement
  if (load) return <Spinner animation="border" variant="primary" />;
  
  // 🔹 Cas où aucune leçon n'existe pour le cours
  if (!listLessons || listLessons.length === 0) return <p>Aucune leçon trouvée.</p>;

  return (
    <div className="lesson-list-container">
      <div className="lesson-grid">
        {listLessons.map((lesson, index) => {
          // 🔹 Vérifier si la leçon doit être désactivée (séquentiel)
          const isDisabled =
            index !== 0 && !user.completedLessons?.includes(listLessons[index - 1]._id);

          return (
            <LessonCard
              key={lesson._id}
              lesson={lesson}
              course={course}
              listLessons={listLessons} // ✅ Passer toute la liste pour navigation entre leçons
              user={user}
              isDisabled={isDisabled} // 🔹 Désactive la leçon si la précédente n'est pas complétée
            />
          );
        })}
      </div>

      {/* 🔹 Bouton retour aux cours */}
      <div className="back-button">
        <Button variant="secondary" onClick={() => navigate("/cours")}>
         Back to Courses
        </Button>
      </div>
    </div>
  );
};

export default LessonList;
