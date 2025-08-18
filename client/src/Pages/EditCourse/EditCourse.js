import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useMatch, useNavigate } from 'react-router-dom';
import { editCourse, getCourse } from '../../JS/Actions/course';
import { Button, Form } from 'react-bootstrap';
import './EditCourse.css';

const EditCourse = () => {
  const dispatch = useDispatch();
  const match = useMatch("/edit/:id");
  const navigate = useNavigate();

  const courseToGet = useSelector(state => state.courseReducer.courseToGet);

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    dispatch(getCourse(match.params.id));
  }, [dispatch, match.params.id]);

  useEffect(() => {
    if (courseToGet && Object.keys(courseToGet).length !== 0) {
      setNewCourse({
        title: courseToGet.title || '',
        description: courseToGet.description || '',
        category: courseToGet.category || ''
      });
    }
  }, [courseToGet]);

  const handleChange = (e) => {
    setNewCourse({
      ...newCourse,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (e) => {
  e.preventDefault();
  dispatch(editCourse(match.params.id, newCourse))
    .then(() => navigate('/cours'))
    .catch(() => alert('Erreur lors de la modification'));
};

  if (!courseToGet || Object.keys(courseToGet).length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div className='edit-product-container'>
      <h2>Edit Course</h2>
      <Form>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name='title'
          value={newCourse.title}
          onChange={handleChange}
        />
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          name='description'
          value={newCourse.description}
          onChange={handleChange}
        />
        <Form.Label>Category</Form.Label>
        <Form.Control
          type="text"
          name='category'
          value={newCourse.category}
          onChange={handleChange}
        />
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
