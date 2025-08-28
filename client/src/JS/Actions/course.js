import axios from "axios";
import {
  ASSIGN_COURSE,
  FAIL_COURSE,
  GET_COURSES,
  GET_COURSE,
  LOAD_COURSE,
  SUCC_COURSE,
  UNASSIGN_COURSE_SUCCESS,
  COMPLETE_COURSE,
} from "../ActionsTypes/course";

// ✅ helper (sans Bearer)
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: token } };
};

export const getCourses = () => async (dispatch) => {
  dispatch({ type: LOAD_COURSE });
  try {
    const result = await axios.get("/api/course/getCourses", getAuthConfig());
    dispatch({
      type: GET_COURSES,
      payload: result.data.courses,
    });
    dispatch({ type: SUCC_COURSE });
  } catch (error) {
    dispatch({
      type: FAIL_COURSE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const addCourse = (newCourse) => async (dispatch) => {
  try {
    await axios.post("/api/course/addcourse", newCourse, getAuthConfig()); // ⚠️ route = addcourse (minuscule)
    dispatch(getCourses());
  } catch (error) {
    dispatch({
      type: FAIL_COURSE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const deleteCourse = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/course/${id}`, getAuthConfig());
    dispatch(getCourses());
  } catch (error) {
    dispatch({
      type: FAIL_COURSE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const editCourse = (id, newCourse) => async (dispatch) => {
  try {
    await axios.put(`/api/course/${id}`, newCourse, getAuthConfig());
    dispatch(getCourses());
  } catch (error) {
    dispatch({
      type: FAIL_COURSE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getCourse = (id) => async (dispatch) => {
  dispatch({ type: LOAD_COURSE });
  try {
    let result = await axios.get(`/api/course/${id}`, getAuthConfig());
    dispatch({
      type: GET_COURSE,
      payload: result.data.courseToGet,
    });
    dispatch({ type: SUCC_COURSE });
  } catch (error) {
    dispatch({
      type: FAIL_COURSE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const assignCourse = (courseId, userId) => async (dispatch) => {
  try {
    const res = await axios.post("/api/course/assign", { courseId, userId }, getAuthConfig());
    dispatch({ type: ASSIGN_COURSE, payload: res.data.course });
  } catch (err) {
    dispatch({ type: FAIL_COURSE, payload: err.response?.data?.message || err.message });
  }
};

export const unassignCourse = (courseId, userId) => async (dispatch) => {
  try {
    const res = await axios.post("/api/course/unassign", { courseId, userId }, getAuthConfig());
    dispatch({ type: UNASSIGN_COURSE_SUCCESS, payload: res.data.course });
  } catch (err) {
    dispatch({ type: FAIL_COURSE, payload: err.response?.data?.message || err.message });
  }
};


export const completeCourse = (courseId) => async (dispatch) => {
  try {
    const config = {
      headers: { Authorization: localStorage.getItem("token") },
    };
    const res = await axios.post("/api/course/complete", { courseId }, config);
    dispatch({ type: COMPLETE_COURSE, payload: res.data.completedCourses });
  } catch (error) {
    console.error(error);
    dispatch({ type: FAIL_COURSE, payload: error.response?.data });
  }
};