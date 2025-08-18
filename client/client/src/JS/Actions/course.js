// get all courses 

import axios from 'axios';
import { FAIL_COURSE, GET_COURSE, LOAD_COURSE, SUCC_COURSE } from '../ActionsTypes/course';

export const getCourses = () => async (dispatch) => {
    dispatch({ type: LOAD_COURSE});
    try {
        let result = await axios.get("/api/course/getCourses")
        dispatch({type: SUCC_COURSE, payload:{listCourses: result.data.courses}});
        
    } catch (error) {
        dispatch({type: FAIL_COURSE, payload: error.response});
        
    }
   
    
};
// add course 
export const addCourse = (newCourse) => async (dispatch) =>{
    try {
        const config ={
            headers:{
                authorization: localStorage.getItem("token"),
            },
        };
        await axios.post("api/course/addCourse",newCourse,config);
        dispatch(getCourses());
    } catch (error) {
        dispatch({type : FAIL_COURSE, payload: error.response});
    }
}

// delete course

export const deleteCourse = (id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
    await axios.delete(`/api/course/${id}`, config);
    dispatch(getCourses());
  } catch (error) {
    dispatch({ type: FAIL_COURSE, payload: error.response });
  }
};

// edit course

export const editCourse = (id, newCourse) => async (dispatch) => {
  try {
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
    await axios.put(`/api/course/${id}`, newCourse, config);
    dispatch(getCourses());
  } catch (error) {
    console.error("Edit Course Error:", error.response?.data || error.message);
    dispatch({ type: FAIL_COURSE, payload: error.response });
  }
};



// get one course

export const getCourse = (id) => async (dispatch) => {
    dispatch({type: LOAD_COURSE});
    try {
        let result = await axios.get(`/api/course/${id}`);
        console.log("GET COURSE SUCCESS", result.data);
        dispatch({ type: GET_COURSE , payload: { courseToGet: result.data.courseToGet } });
    } catch (error) {
        console.error("GET COURSE ERROR", error.response?.data || error.message);
        dispatch({type : FAIL_COURSE, payload: error.response});
    }
}

