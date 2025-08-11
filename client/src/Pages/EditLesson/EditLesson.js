import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getLesson, editLesson } from '../../JS/Actions/lesson';
import { Button } from 'react-bootstrap';

const EditLesson = () => {
  const { lessonId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Récupérer les données de la leçon depuis le store Redux
  const { lessonToGet, load, error } = useSelector(state => state.lessonReducer);

  // State local pour gérer le formulaire
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
  });

  // Dès que lessonToGet change (après fetch), remplir formData
  useEffect(() => {
    if (lessonToGet && lessonToGet._id === lessonId) {
      setFormData({
        title: lessonToGet.title || '',
        content: lessonToGet.content || '',
        videoUrl: lessonToGet.videoUrl || '',
      });
    }
  }, [lessonToGet, lessonId]);

  // Au chargement, récupérer la leçon à éditer
  useEffect(() => {
    dispatch(getLesson(lessonId));
  }, [dispatch, lessonId]);

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  // Envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(editLesson(lessonId, formData));
    // Redirection vers la liste des leçons, adapte l’URL si besoin
    navigate(`/course/${lessonToGet.courseId}/lessons`);

  };

  if (load) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message || error}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Titre de la leçon"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="content"
        placeholder="Contenu de la leçon"
        value={formData.content}
        onChange={handleChange}
        required
      />
      
      <Button type="submit">Modifier la leçon</Button>
      <Button variant="secondary" onClick={() => navigate(-1)}>
        Annuler
      </Button>
    </form>
  );
};

export default EditLesson;
