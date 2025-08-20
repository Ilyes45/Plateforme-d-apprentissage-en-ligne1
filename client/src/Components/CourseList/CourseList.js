import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCourses } from "../../JS/Actions/course";
import CourseCard from "../CourseCard/CourseCard";
import { Spinner } from "react-bootstrap";
import "./CourseListe.css";

const CourseList = () => {
  const dispatch = useDispatch();
  const listCourses = useSelector((state) => state.courseReducer.listCourses);
  const load = useSelector((state) => state.courseReducer.load);

  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);

  if (load) return <Spinner animation="border" variant="primary" />;
  if (!Array.isArray(listCourses) || listCourses.length === 0)
    return <h2>Aucun cours trouvé</h2>;

  // 🔹 Regrouper les cours par catégorie
  const coursesByCategory = listCourses.reduce((acc, course) => {
    if (!acc[course.category]) acc[course.category] = [];
    acc[course.category].push(course);
    return acc;
  }, {});

  // 🔹 Filtrer par recherche (nom + description si dispo)
  const filteredCoursesByCategory = Object.keys(coursesByCategory).reduce(
    (acc, category) => {
      const filteredCourses = coursesByCategory[category].filter((course) => {
        const name = (course.name || "").toLowerCase();
        const desc = (course.description || "").toLowerCase();
        const term = searchTerm.toLowerCase();
        return name.includes(term) || desc.includes(term);
      });
      if (filteredCourses.length > 0) acc[category] = filteredCourses;
      return acc;
    },
    {}
  );

  // 🔹 Vérifier si résultats
  const hasResults = Object.keys(filteredCoursesByCategory).length > 0;

  // 🔹 Liste des catégories
  const categories = ["Toutes", ...Object.keys(coursesByCategory)];

  return (
    <div className="course-page">
      {/* 🔹 Sidebar */}
      <aside className="sidebar">
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un cours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <h3>Catégories</h3>
        <ul>
          {categories.map((cat) => (
            <li
              key={cat}
              className={selectedCategory === cat ? "active" : ""}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      {/* 🔹 Contenu principal */}
      <main className="course-list-container">
        {!hasResults ? (
          <h2>Aucun cours ne correspond à votre recherche</h2>
        ) : selectedCategory === "Toutes" ? (
          Object.keys(filteredCoursesByCategory).map((category) => (
            <div key={category} className="course-category-section">
              <h2 className="category-title">{category}</h2>
              <div className="course-grid">
                {filteredCoursesByCategory[category].map((el) => (
                  <CourseCard key={el._id} course={el} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="course-category-section">
            <h2 className="category-title">{selectedCategory}</h2>
            <div className="course-grid">
              {filteredCoursesByCategory[selectedCategory]?.map((el) => (
                <CourseCard key={el._id} course={el} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseList;
