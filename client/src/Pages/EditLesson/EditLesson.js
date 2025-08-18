import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getLesson, editLesson } from '../../JS/Actions/lesson';
import { Button } from 'react-bootstrap';
import './EditLesson.css'; // Assure-toi d'importer le CSS

const EditLesson = () => {
  const { lessonId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { lessonToGet, load, error } = useSelector(state => state.lessonReducer);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
  });

  useEffect(() => {
    if (lessonToGet && lessonToGet._id === lessonId) {
      setFormData({
        title: lessonToGet.title || '',
        content: lessonToGet.content || '',
        videoUrl: lessonToGet.videoUrl || '',
      });
    }
  }, [lessonToGet, lessonId]);

  useEffect(() => {
    dispatch(getLesson(lessonId));
  }, [dispatch, lessonId]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(editLesson(lessonId, formData));
    navigate(`/course/${lessonToGet.courseId}/lessons`);
  };

  if (load) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message || error}</p>;

  return (
    <div className="edit-lesson-page">
      <div className="edit-lesson-container">
        <h2>Modifier la leçon</h2>
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
          <Button type="submit" className="btn-primary">Modifier la leçon</Button>
        </form>
        <Button variant="secondary" onClick={() => navigate(-1)}>Annuler</Button>
      </div>
    </div>
  );
};

export default EditLesson;
