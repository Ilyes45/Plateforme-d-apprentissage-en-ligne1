import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { addLesson } from '../../JS/Actions/lesson';
import { Button } from 'react-bootstrap';

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
    await dispatch(addLesson(lessonData));  // attends que l’ajout soit fait
    navigate(`/course/${courseId}/lessons`); // navigation vers la liste des leçons du cours
  } catch (error) {
    console.error("Erreur lors de l'ajout de la leçon:", error);
  }
};

  return (
    <div>
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
      <input
        type="text"
        name="videoUrl"
        placeholder="URL de la vidéo (optionnel)"
        value={lessonData.videoUrl}
        onChange={handleChange}
      />
      <Button type="submit" onClick={handleSubmit}>Ajouter la leçon</Button>
    </form>
     <Button variant="primary" onClick={() => navigate('/cours')}>
      Retour aux cours
    </Button>
    </div>
  );
  
};

export default AddLesson;
