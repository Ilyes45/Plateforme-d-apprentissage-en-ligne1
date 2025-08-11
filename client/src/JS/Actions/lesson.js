// get all courses 

import axios from 'axios';
import { FAIL_LESSON, GET_LESSON, LOAD_LESSON, SUCC_LESSON } from '../ActionsTypes/lesson';

export const getLessons = (courseId) => async (dispatch) => {
  dispatch({ type: LOAD_LESSON });
  try {
    let url = "/api/lesson/getLessons";
    if (courseId) {
      url += `?courseId=${courseId}`;
    }
    console.log("Fetching lessons for courseId:", courseId);
    let result = await axios.get(url);
    dispatch({ type: SUCC_LESSON, payload: { listLessons: result.data.lessons } });
  } catch (error) {
    dispatch({ type: FAIL_LESSON, payload: error.response });
  }
};

// add lesson
export const addLesson = (newLesson) => async (dispatch) =>{
    try {
        const config ={
            headers:{
                authorization: localStorage.getItem("token"),
            },
        };
        await axios.post("/api/lesson/addlesson",newLesson,config);
         dispatch(getLessons(newLesson.courseId)); 
    } catch (error) {
        dispatch({type : FAIL_LESSON, payload: error.response?.data?.message || error.message});
    }
}

// delete lesson

export const deleteLesson = (id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
    await axios.delete(`/api/lesson/${id}`, config);
    dispatch(getLessons());
  } catch (error) {
    dispatch({ type: FAIL_LESSON, payload: error.response });
  }
};

// edit lesson

export const editLesson = (id, newLesson) => async (dispatch) => {
  try {
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
    await axios.put(`/api/lesson/${id}`, newLesson, config);
    dispatch(getLessons());
  } catch (error) {
    console.error("Edit Lesson Error:", error.response?.data || error.message);
    dispatch({ type: FAIL_LESSON, payload: error.response });
  }
};



// get one lesson

export const getLesson = (id) => async (dispatch) => {
    dispatch({type: LOAD_LESSON});
    try {
        let result = await axios.get(`/api/lesson/${id}`);
        dispatch({ type: GET_LESSON , payload: { lessonToGet: result.data.lessonToGet } });
    } catch (error) {
        console.error("GET LESSON ERROR", error.response?.data || error.message);
        dispatch({type : FAIL_LESSON, payload: error.response});
    }
}

