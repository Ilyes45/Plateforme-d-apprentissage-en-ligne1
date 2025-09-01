import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCourse, assignCourse } from '../../JS/Actions/course';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Addcourse.css';

const Addcourse = () => {
  const [newCourse, setNewCourse] = useState({}); // État local pour stocker les données du formulaire
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.userReducer.user); // Utilisateur connecté

  // Fonction pour mettre à jour les champs du formulaire
  const handleChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  // Fonction appelée lors de l'ajout du cours
  const add = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    try {
      // 1️⃣ Ajouter le cours via l'action Redux
      const res = await dispatch(addCourse(newCourse));

      // 2️⃣ Récupérer l'ID du cours ajouté depuis la réponse
      const addedCourseId = res?.data?.course?._id;

      // 3️⃣ Assigner automatiquement le cours au créateur si un utilisateur est connecté
      if (addedCourseId && user) {
        await dispatch(assignCourse(addedCourseId, user._id));
      }

      // 4️⃣ Rediriger vers la page des cours
      navigate('/cours');
    } catch (err) {
      console.error('Erreur ajout cours:', err);
    }
  };

  return (
    <div className="add-course-container">
      <h2>Add Course</h2>
      <Form>
        {/* Champ Titre */}
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Title"
          name="title"
          value={newCourse.title || ''}
          onChange={handleChange}
        />

        {/* Champ Description */}
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Description"
          name="description"
          value={newCourse.description || ''}
          onChange={handleChange}
        />

        {/* Champ Catégorie */}
        <Form.Label>Category</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter category"
          name="category"
          value={newCourse.category || ''}
          onChange={handleChange}
        />

        {/* Bouton Ajouter */}
        <Button variant="primary" type="submit" onClick={add} style={{ marginTop: '10px' }}>
          Add 
        </Button>
      </Form>
    </div>
  );
};

export default Addcourse;
