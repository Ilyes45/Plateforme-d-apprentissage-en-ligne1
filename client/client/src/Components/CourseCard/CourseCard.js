import React from 'react'
import { Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteCourse } from '../../JS/Actions/course';

const CourseCard = ({ course }) => {
    const dispatch = useDispatch();
    const navigate= useNavigate();
    
    const user = useSelector((state) => state.userReducer.user);
  return (
    <div>
      <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{course.title}</Card.Title>
        <Card.Text>{course.description} </Card.Text>
        <Card.Text>{course.category} </Card.Text>
        <div className="d-flex gap-2">

  <Button variant="primary" onClick={() => navigate(`/course/${course._id}/lessons`)}>
  Voir Lesson
</Button> 


  {user && user._id === course.createdBy && (
    <>
    <Button variant="primary" onClick={() => navigate(`/add-lesson/${course._id}`)}>Add Lesson </Button>
      <Button variant="primary" onClick={() => navigate(`/edit/${course._id}`)}>Edit Course</Button>
      <Button variant="primary" onClick={() => dispatch(deleteCourse(course._id))}>Delete Course</Button>
    </>
  )}
</div>
         
       
      </Card.Body>
    </Card>
    </div>
  )
}

export default CourseCard
