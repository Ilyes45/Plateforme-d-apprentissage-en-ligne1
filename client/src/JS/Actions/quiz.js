import axios from 'axios';
import { SUCC_QUIZ, LOAD_QUIZ, FAIL_QUIZ, GET_QUIZ } from '../ActionsTypes/quiz';

// 🔹 Helper pour l'authentification
const getAuthConfig = () => ({
  headers: { authorization: localStorage.getItem("token") },
});

// 🔹 Récupérer les quizzes d'une leçon
export const getQuizzes = (lessonId) => async (dispatch) => {
  dispatch({ type: LOAD_QUIZ });
  try {
    const res = await axios.get(`/api/quiz/lesson/${lessonId}`, getAuthConfig());
    dispatch({
      type: SUCC_QUIZ,
      payload: { listQuizzes: res.data.quizzes || [] }
    });
  } catch (error) {
    dispatch({
      type: FAIL_QUIZ,
      payload: error.response?.data?.message || error.message
    });
  }
};

// 🔹 Récupérer un quiz par ID
export const getQuiz = (quizId) => async (dispatch) => {
  dispatch({ type: LOAD_QUIZ });
  try {
    const res = await axios.get(`/api/quiz/${quizId}`, getAuthConfig());
    dispatch({
      type: GET_QUIZ,
      payload: { quizToGet: res.data.quiz }
    });
  } catch (error) {
    dispatch({
      type: FAIL_QUIZ,
      payload: error.response?.data?.message || error.message
    });
  }
};

// 🔹 Marquer un quiz comme complété
export const completeQuiz = (quizId) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/user/${quizId}/complete`, {}, getAuthConfig());
    // Retourner les données de progression si besoin
    return res.data;
  } catch (error) {
    console.error("Erreur completeQuiz:", error.response?.data?.message || error.message);
    throw error;
  }
};

// 🔹 Ajouter un quiz
export const createQuiz = (newQuiz) => async (dispatch) => {
  try {
    await axios.post("/api/quiz/addquiz", newQuiz, getAuthConfig());
    dispatch(getQuizzes(newQuiz.lessonId));
  } catch (error) {
    dispatch({ type: FAIL_QUIZ, payload: error.response?.data?.message || error.message });
  }
};

// 🔹 Supprimer un quiz
export const deleteQuiz = (id, lessonId) => async (dispatch) => {
  try {
    await axios.delete(`/api/quiz/${id}`, getAuthConfig());
    dispatch(getQuizzes(lessonId));
  } catch (error) {
    dispatch({ type: FAIL_QUIZ, payload: error.response?.data?.message || error.message });
  }
};

// 🔹 Modifier un quiz
export const editQuiz = (id, newQuiz, lessonId) => async (dispatch) => {
  try {
    await axios.put(`/api/quiz/${id}`, newQuiz, getAuthConfig());
    dispatch(getQuizzes(lessonId));
  } catch (error) {
    dispatch({ type: FAIL_QUIZ, payload: error.response?.data?.message || error.message });
  }
};
