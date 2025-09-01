import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useMatch, useNavigate } from 'react-router-dom';
import { editCourse, getCourse } from '../../JS/Actions/course';
import { Button, Form } from 'react-bootstrap';
import './EditCourse.css';

const EditCourse = () => {
  const dispatch = useDispatch();
  const match = useMatch("/edit/:id"); // Récupère l'ID du cours depuis l'URL
  const navigate = useNavigate(); // Pour rediriger après modification

  // Récupération du cours depuis Redux
  const courseToGet = useSelector(state => state.courseReducer.courseToGet);

  // État local pour gérer le formulaire
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: ''
  });

  // Charger le cours lors du montage du composant
  useEffect(() => {
    dispatch(getCourse(match.params.id));
  }, [dispatch, match.params.id]);

  // Mettre à jour le formulaire lorsque le cours est chargé
  useEffect(() => {
    if (courseToGet && Object.keys(courseToGet).length !== 0) {
      setNewCourse({
        title: courseToGet.title || '',
        description: courseToGet.description || '',
        category: courseToGet.category || ''
      });
    }
  }, [courseToGet]);

  // Met à jour l'état local à chaque changement dans le formulaire
  const handleChange = (e) => {
    setNewCourse({
      ...newCourse,
      [e.target.name]: e.target.value
    });
  };

  // Soumettre les modifications
  const handleEdit = (e) => {
    e.preventDefault();
    dispatch(editCourse(match.params.id, newCourse))
      .then(() => navigate('/cours')) // Redirige vers la liste des cours après succès
      .catch(() => alert('Erreur lors de la modification'));
  };

  // Affichage conditionnel pendant le chargement
  if (!courseToGet || Object.keys(courseToGet).length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div className='edit-product-container'>
      <h2>Edit Course</h2>
      <Form>
        {/* Champ titre */}
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name='title'
          value={newCourse.title}
          onChange={handleChange}
        />
        {/* Champ description */}
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          name='description'
          value={newCourse.description}
          onChange={handleChange}
        />
        {/* Champ catégorie */}
        <Form.Label>Category</Form.Label>
        <Form.Control
          type="text"
          name='category'
          value={newCourse.category}
          onChange={handleChange}
        />
        {/* Boutons */}
        <Button variant="primary" type="button" onClick={handleEdit}>
          Edit
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Annuler
        </Button>
      </Form>
    </div>
  );
};

export default EditCourse;
