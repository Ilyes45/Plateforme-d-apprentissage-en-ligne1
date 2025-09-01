import axios from 'axios';
import { FAIL_LESSON, GET_LESSON, LOAD_LESSON, SUCC_LESSON } from '../ActionsTypes/lesson';

// 🔹 Récupérer toutes les leçons, optionnellement filtrées par courseId
export const getLessons = (courseId) => async (dispatch) => {
  dispatch({ type: LOAD_LESSON }); // indique que le chargement commence
  try {
    let url = "/api/lesson/getLessons";
    if (courseId) {
      url += `?courseId=${courseId}`; // filtre par cours si courseId fourni
    }
    console.log("Fetching lessons for courseId:", courseId); // debug
    let result = await axios.get(url);
    dispatch({ type: SUCC_LESSON, payload: { listLessons: result.data.lessons } }); // succès : stocke les leçons
  } catch (error) {
    dispatch({ type: FAIL_LESSON, payload: error.response }); // échec : stocke l'erreur
  }
};

// 🔹 Ajouter une nouvelle leçon
export const addLesson = (newLesson) => async (dispatch) => {
  try {
    const config = {
      headers: {
        authorization: localStorage.getItem("token"), // token pour auth
      },
    };
    await axios.post("/api/lesson/addlesson", newLesson, config); // envoie la leçon au backend
    dispatch(getLessons(newLesson.courseId)); // recharge les leçons du cours
  } catch (error) {
    dispatch({ type: FAIL_LESSON, payload: error.response?.data?.message || error.message });
  }
};

// 🔹 Supprimer une leçon
export const deleteLesson = (id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
    await axios.delete(`/api/lesson/${id}`, config); // suppression côté serveur
    dispatch(getLessons()); // recharge toutes les leçons
  } catch (error) {
    dispatch({ type: FAIL_LESSON, payload: error.response }); // échec
  }
};

// 🔹 Modifier une leçon existante
export const editLesson = (id, newLesson) => async (dispatch) => {
  try {
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
    await axios.put(`/api/lesson/${id}`, newLesson, config); // mise à jour côté serveur
    dispatch(getLessons()); // recharge les leçons
  } catch (error) {
    console.error("Edit Lesson Error:", error.response?.data || error.message); // log erreur
    dispatch({ type: FAIL_LESSON, payload: error.response }); // échec
  }
};

// 🔹 Récupérer une leçon spécifique par ID
export const getLesson = (id) => async (dispatch) => {
  dispatch({ type: LOAD_LESSON }); // début du chargement
  try {
    const result = await axios.get(`/api/lesson/${id}`); // récupère la leçon
    console.log("Lesson reçue :", result.data.lesson); // debug
    dispatch({ type: GET_LESSON, payload: { lessonToGet: result.data.lesson } }); // succès : stocke la leçon spécifique
  } catch (error) {
    console.error("GET LESSON ERROR", error.response?.data || error.message); // log erreur
    dispatch({ type: FAIL_LESSON, payload: error.response }); // échec
  }
};
