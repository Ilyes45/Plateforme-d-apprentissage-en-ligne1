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

// 🔹 Helper pour ajouter le token aux requêtes
const getAuthConfig = () => {
  const token = localStorage.getItem("token"); // récupération token stocké
  return { headers: { Authorization: token } }; // renvoie config axios
};

// 🔹 Récupérer tous les cours
export const getCourses = () => async (dispatch) => {
  dispatch({ type: LOAD_COURSE }); // loading = true
  try {
    const result = await axios.get("/api/course/getCourses", getAuthConfig()); // fetch backend
    dispatch({
      type: GET_COURSES,
      payload: result.data.courses, // stocke la liste de tous les cours
    });
    dispatch({ type: SUCC_COURSE }); // loading = false + succès
  } catch (error) {
    dispatch({
      type: FAIL_COURSE, // échec
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 🔹 Ajouter un nouveau cours
export const addCourse = (newCourse) => async (dispatch) => {
  try {
    await axios.post("/api/course/addcourse", newCourse, getAuthConfig()); // ajout backend
    dispatch(getCourses()); // recharge la liste après ajout
  } catch (error) {
    dispatch({
      type: FAIL_COURSE, // échec
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 🔹 Supprimer un cours
export const deleteCourse = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/course/${id}`, getAuthConfig()); // suppression backend
    dispatch(getCourses()); // recharge la liste
  } catch (error) {
    dispatch({
      type: FAIL_COURSE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 🔹 Modifier un cours
export const editCourse = (id, newCourse) => async (dispatch) => {
  try {
    await axios.put(`/api/course/${id}`, newCourse, getAuthConfig()); // update backend
    dispatch(getCourses()); // recharge la liste
  } catch (error) {
    dispatch({
      type: FAIL_COURSE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 🔹 Récupérer un cours spécifique par ID
export const getCourse = (id) => async (dispatch) => {
  dispatch({ type: LOAD_COURSE }); // loading
  try {
    let result = await axios.get(`/api/course/${id}`, getAuthConfig());
    dispatch({
      type: GET_COURSE,
      payload: result.data.courseToGet, // stocke le cours spécifique
    });
    dispatch({ type: SUCC_COURSE }); // succès
  } catch (error) {
    dispatch({
      type: FAIL_COURSE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 🔹 Assigner un cours à un utilisateur
export const assignCourse = (courseId, userId) => async (dispatch) => {
  try {
    const res = await axios.post("/api/course/assign", { courseId, userId }, getAuthConfig());
    dispatch({ type: ASSIGN_COURSE, payload: res.data.course }); // met à jour le cours assigné
  } catch (err) {
    dispatch({ type: FAIL_COURSE, payload: err.response?.data?.message || err.message });
  }
};

// 🔹 Désassigner un cours d'un utilisateur
export const unassignCourse = (courseId, userId) => async (dispatch) => {
  try {
    const res = await axios.post("/api/course/unassign", { courseId, userId }, getAuthConfig());
    dispatch({ type: UNASSIGN_COURSE_SUCCESS, payload: res.data.course });
  } catch (err) {
    dispatch({ type: FAIL_COURSE, payload: err.response?.data?.message || err.message });
  }
};

// 🔹 Marquer un cours comme complété
export const completeCourse = (courseId) => async (dispatch) => {
  try {
    const config = {
      headers: { Authorization: localStorage.getItem("token") },
    };
    const res = await axios.post("/api/course/complete", { courseId }, config);
    dispatch({ type: COMPLETE_COURSE, payload: res.data.completedCourses }); // met à jour completedCourses
  } catch (error) {
    console.error(error); // log erreur
    dispatch({ type: FAIL_COURSE, payload: error.response?.data });
  }
};
