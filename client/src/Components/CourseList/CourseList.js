import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses } from '../../JS/Actions/course';
import CourseCard from '../CourseCard/CourseCard';
import './CourseListe.css';

const CourseList = () => {
  const dispatch = useDispatch();
  const listCourses = useSelector((state) => state.courseReducer.listCourses);
  const load = useSelector((state) => state.courseReducer.load);

  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);

  if (load) return <h2>Loading...</h2>;
  if (!Array.isArray(listCourses) || listCourses.length === 0)
    return <h2>Aucun cours trouvé</h2>;

  return (
    <div className="course-grid">
      {listCourses.map((el) => (
        <CourseCard key={el._id} course={el} />
      ))}
    </div>
  );
};

export default CourseList;
