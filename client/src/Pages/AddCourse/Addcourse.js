import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCourse, assignCourse } from '../../JS/Actions/course';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Addcourse.css';

const Addcourse = () => {
  const [newCourse, setNewCourse] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.userReducer.user);

  const handleChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const add = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Ajouter le cours
      const res = await dispatch(addCourse(newCourse));

      // 2️⃣ Récupérer l'id du cours ajouté
      const addedCourseId = res?.data?.course?._id;
      if (addedCourseId && user) {
        // 3️⃣ Assigner automatiquement le cours au créateur (si non-admin)
        await dispatch(assignCourse(addedCourseId, user._id));
      }

      // 4️⃣ Naviguer vers la liste des cours
      navigate('/cours');
    } catch (err) {
      console.error('Erreur ajout cours:', err);
    }
  };

  return (
    <div className="add-course-container">
      <h2>Ajouter un cours</h2>
      <Form>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Title"
          name="title"
          value={newCourse.title || ''}
          onChange={handleChange}
        />
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Description"
          name="description"
          value={newCourse.description || ''}
          onChange={handleChange}
        />
        <Form.Label>Category</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter category"
          name="category"
          value={newCourse.category || ''}
          onChange={handleChange}
        />
        <Button variant="primary" type="submit" onClick={add} style={{ marginTop: '10px' }}>
          Ajouter
        </Button>
      </Form>
    </div>
  );
};

export default Addcourse;
