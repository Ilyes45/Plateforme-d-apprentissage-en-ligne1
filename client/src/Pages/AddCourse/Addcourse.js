import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { addCourse } from '../../JS/Actions/course';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Addcourse = () => {

    const [newCourse, setNewCourse] =useState({});
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setNewCourse({
            ...newCourse,
            [e.target.name]: e.target.value
        });
    }
    const add = (e) => {
        dispatch(addCourse(newCourse));
    };

      return (
   
      <div className="add-course-container">
      <h2>Add Course</h2>
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
        <Link to="/cours">
          <Button variant="primary" type="submit" onClick={add}>
            Add
          </Button>
        </Link>
      </Form>

    </div>
  )
}

export default Addcourse
