import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { addLesson } from '../../JS/Actions/lesson'; // action Redux pour ajouter une leçon
import { Button } from 'react-bootstrap';
import './AddLesson.css'; // CSS spécifique au composant

const AddLesson = () => {
  const { courseId } = useParams(); // récupération de l'ID du cours depuis l'URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // État local pour stocker les données de la leçon
  const [lessonData, setLessonData] = useState({
    title: '',      // titre de la leçon
    content: '',    // contenu de la leçon
    videoUrl: '',   // lien vidéo (optionnel)
    courseId: courseId, // ID du cours parent
  });

  // Mise à jour des champs du formulaire
  const handleChange = (e) => {
    setLessonData({ ...lessonData, [e.target.name]: e.target.value });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addLesson(lessonData)); // dispatch action Redux pour créer la leçon
      navigate(`/course/${courseId}/lessons`); // redirection vers la liste des leçons du cours
    } catch (error) {
      console.error("Erreur lors de l'ajout de la leçon:", error);
    }
  };

  return (
    <div className="add-lesson-page">
      <div className="add-lesson-container">
        <h2>Ajouter une leçon</h2>
        <form onSubmit={handleSubmit}>
          {/* Champ pour le titre */}
          <input
            type="text"
            name="title"
            placeholder="Titre de la leçon"
            value={lessonData.title}
            onChange={handleChange}
            required
          />
          {/* Champ pour le contenu */}
          <textarea
            name="content"
            placeholder="Contenu de la leçon"
            value={lessonData.content}
            onChange={handleChange}
            required
          />
          <Button type="submit" className="btn-primary">
            Ajouter la leçon
          </Button>
        </form>
        {/* Bouton pour revenir à la page des cours sans enregistrer */}
        <Button variant="secondary" onClick={() => navigate('/cours')}>
          Retour aux cours
        </Button>
      </div>
    </div>
  );
};

export default AddLesson;
