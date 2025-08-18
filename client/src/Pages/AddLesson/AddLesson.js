import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { addLesson } from '../../JS/Actions/lesson';
import { Button } from 'react-bootstrap';
import './AddLesson.css'; // Assure-toi d'importer le CSS

const AddLesson = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [lessonData, setLessonData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    courseId: courseId,
  });

  const handleChange = (e) => {
    setLessonData({ ...lessonData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addLesson(lessonData));
      navigate(`/course/${courseId}/lessons`);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la leçon:", error);
    }
  };

  return (
    <div className="add-lesson-page">
      <div className="add-lesson-container">
        <h2>Ajouter une leçon</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Titre de la leçon"
            value={lessonData.title}
            onChange={handleChange}
            required
          />
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
        <Button variant="secondary" onClick={() => navigate('/cours')}>
          Retour aux cours
        </Button>
      </div>
    </div>
  );
};

export default AddLesson;
