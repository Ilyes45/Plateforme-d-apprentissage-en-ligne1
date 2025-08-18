import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getCourses } from '../../JS/Actions/course';
import CourseCard from '../CourseCard/CourseCard';

const CourseList = () => {
    const dispatch = useDispatch();
    const listCourses= useSelector((state) => state.courseReducer.listCourses);
    const load = useSelector((state) => state.courseReducer.load);
  
  useEffect(() => {
    dispatch(getCourses());
    }, [dispatch]);
    
    
    return (
    <div className="course-list">
       {load ? (
        <h2>Loading...</h2>
      ) : Array.isArray(listCourses) ? (
        <div className="product-list">
          {listCourses.map((el) => (
            <CourseCard key={el._id} course={el} />
          ))}
        </div>
      ) : (
        <h2>No Courses found</h2>
      )}
    </div>
  )
}

export default CourseList
