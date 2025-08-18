import React from 'react';
import CourseList from '../../Components/CourseList/CourseList';
import './Cours.css';

const Cours = () => {
  return (
    <div className="cours-container">
      <h1>Liste des Cours</h1>
      <CourseList />
    </div>
  );
};

export default Cours;
