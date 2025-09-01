import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getLesson, editLesson } from '../../JS/Actions/lesson';
import { Button } from 'react-bootstrap';
import './EditLesson.css'; // CSS spécifique au composant

const EditLesson = () => {
  const { lessonId } = useParams(); // Récupère l'ID de la leçon depuis l'URL
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Pour naviguer après la modification

  // Récupère la leçon et les états de chargement / erreur depuis Redux
  const { lessonToGet, load, error } = useSelector(state => state.lessonReducer);

  // État local pour gérer le formulaire de modification
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
  });

  // Quand la leçon est chargée, remplir le formulaire
  useEffect(() => {
    if (lessonToGet && lessonToGet._id === lessonId) {
      setFormData({
        title: lessonToGet.title || '',
        content: lessonToGet.content || '',
        videoUrl: lessonToGet.videoUrl || '',
      });
    }
  }, [lessonToGet, lessonId]);

  // Charger la leçon au montage du composant
  useEffect(() => {
    dispatch(getLesson(lessonId));
  }, [dispatch, lessonId]);

  // Mettre à jour l'état local à chaque changement de champ
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  // Soumettre le formulaire pour modifier la leçon
  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(editLesson(lessonId, formData)); // Action Redux pour éditer la leçon
    navigate(`/course/${lessonToGet.courseId}/lessons`); // Redirige vers la liste des leçons du cours
  };

  // Affichage conditionnel pendant le chargement ou en cas d'erreur
  if (load) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message || error}</p>;

  return (
    <div className="edit-lesson-page">
      <div className="edit-lesson-container">
        <h2>Modifier la leçon</h2>
        <form onSubmit={handleSubmit}>
          {/* Champ titre de la leçon */}
          <input
            type="text"
            name="title"
            placeholder="Titre de la leçon"
            value={formData.title}
            onChange={handleChange}
            required
          />
          {/* Champ contenu de la leçon */}
          <textarea
            name="content"
            placeholder="Contenu de la leçon"
            value={formData.content}
            onChange={handleChange}
            required
          />
          {/* Bouton pour valider les modifications */}
          <Button type="submit" className="btn-primary">Modifier la leçon</Button>
        </form>
        {/* Bouton pour annuler et revenir en arrière */}
        <Button variant="secondary" onClick={() => navigate(-1)}>Annuler</Button>
      </div>
    </div>
  );
};

export default EditLesson;
