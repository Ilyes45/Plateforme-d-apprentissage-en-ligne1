import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCourses } from "../../JS/Actions/course";
import { getUserProgress } from "../../JS/Actions/user";
import CourseCard from "../CourseCard/CourseCard";
import { Spinner, ProgressBar } from "react-bootstrap";
import "./CourseListe.css";

const CourseList = () => {
  const dispatch = useDispatch();

  // 🔹 Récupération des données depuis le store Redux
  const { listCourses, load } = useSelector((state) => state.courseReducer);
  const user = useSelector((state) => state.userReducer.user);
  const userProgressStore = useSelector((state) => state.userReducer.userProgress);

  // 🔹 Etats pour filtrage et recherche
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Chargement des cours et de la progression utilisateur
  useEffect(() => {
    dispatch(getCourses());
    if (user?._id && user.role !== "admin") {
      dispatch(getUserProgress(user._id));
    }
  }, [dispatch, user?._id, user?.role]);

  // 🔹 Gestion des états de chargement et d'absence de cours
  if (load) return <Spinner animation="border" variant="primary" />;
  if (!Array.isArray(listCourses) || listCourses.length === 0)
    return <h2>Aucun cours trouvé</h2>;

  // 🔹 Filtrage des cours selon le rôle (admin voit tout)
  const visibleCourses = user
    ? user.role === "admin"
      ? listCourses
      : listCourses.filter((course) =>
          course.assignedTo?.some((u) => u._id === user._id)
        )
    : listCourses;

  // 🔹 Sécurisation des données de progression
  const progressData = userProgressStore[user?._id] || {};
  const progress = {
    courses: progressData.courses || { completed: 0, total: 0 },
    lessons: progressData.lessons || { completed: 0, total: 0 },
    quizzes: progressData.quizzes || { completed: 0, total: 0 },
  };

  const percent = (done, total) => (total > 0 ? Math.round((done / total) * 100) : 0);

  // 🔹 Regroupement des cours par catégorie
  const coursesByCategory = visibleCourses.reduce((acc, course) => {
    const category = course.category || "Autres";
    if (!acc[category]) acc[category] = [];
    acc[category].push(course);
    return acc;
  }, {});

  // 🔹 Filtrage par recherche
  const filteredCoursesByCategory = Object.keys(coursesByCategory).reduce(
    (acc, category) => {
      const filteredCourses = coursesByCategory[category].filter((course) => {
        const title = (course.title || "").toLowerCase();
        const desc = (course.description || "").toLowerCase();
        const term = searchTerm.toLowerCase();
        return title.includes(term) || desc.includes(term);
      });
      if (filteredCourses.length > 0) acc[category] = filteredCourses;
      return acc;
    },
    {}
  );

  const hasResults = Object.keys(filteredCoursesByCategory).length > 0;
  const categories = ["Toutes", ...Object.keys(coursesByCategory)];

  return (
    <div className="course-page">
      {/* 🔹 Sidebar : progression et recherche */}
      <aside className="sidebar">
        {user && user.role !== "admin" && (
          <div className="sidebar-progress" style={{ marginBottom: "20px" }}>
            <h4>Progression globale</h4>
            {/* 🔹 Progression globale combinée */}
            <ProgressBar
              now={percent(
                progress.courses.completed + progress.lessons.completed + progress.quizzes.completed,
                progress.courses.total + progress.lessons.total + progress.quizzes.total
              )}
              variant="success"
              label={`Global ${percent(
                progress.courses.completed + progress.lessons.completed + progress.quizzes.completed,
                progress.courses.total + progress.lessons.total + progress.quizzes.total
              )}%`}
              style={{ marginBottom: "10px" }}
            />
            {/* 🔹 Progression par type */}
            <ProgressBar
              now={percent(progress.courses.completed, progress.courses.total)}
              label={`Cours ${progress.courses.completed}/${progress.courses.total}`}
              style={{ marginBottom: "10px" }}
            />
            <ProgressBar
              now={percent(progress.lessons.completed, progress.lessons.total)}
              variant="info"
              label={`Leçons ${progress.lessons.completed}/${progress.lessons.total}`}
              style={{ marginBottom: "10px" }}
            />
            <ProgressBar
              now={percent(progress.quizzes.completed, progress.quizzes.total)}
              variant="warning"
              label={`Quiz ${progress.quizzes.completed}/${progress.quizzes.total}`}
            />
          </div>
        )}

        {/* 🔹 Barre de recherche */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un cours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 🔹 Catégories */}
        <h3>Catégories</h3>
        <ul>
          {categories.map((cat, idx) => (
            <li
              key={`${cat}-${idx}`}
              className={selectedCategory === cat ? "active" : ""}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      {/* 🔹 Contenu principal : liste des cours */}
      <main className="course-list-container">
        {!hasResults ? (
          <h2>Aucun cours ne correspond à votre recherche</h2>
        ) : selectedCategory === "Toutes" ? (
          Object.keys(filteredCoursesByCategory).map((category) => (
            <div key={category} className="course-category-section">
              <h2 className="category-title">{category}</h2>
              <div className="course-grid">
                {filteredCoursesByCategory[category].map((course, idx) => (
                  <CourseCard key={course._id || idx} course={course} user={user} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="course-category-section">
            <h2 className="category-title">{selectedCategory}</h2>
            <div className="course-grid">
              {filteredCoursesByCategory[selectedCategory]?.map((course, idx) => (
                <CourseCard key={course._id || idx} course={course} user={user} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseList;
