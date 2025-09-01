import axios from 'axios';
import { SUCC_QUIZ, LOAD_QUIZ, FAIL_QUIZ, GET_QUIZ } from '../ActionsTypes/quiz';

// 🔹 Helper pour configurer l'authentification avec le token
const getAuthConfig = () => ({
  headers: { authorization: localStorage.getItem("token") },
});

// 🔹 Récupérer tous les quizzes d'une leçon
export const getQuizzes = (lessonId) => async (dispatch) => {
  dispatch({ type: LOAD_QUIZ }); // indique que le chargement commence
  try {
    const res = await axios.get(`/api/quiz/lesson/${lessonId}`, getAuthConfig()); // fetch quizzes
    dispatch({
      type: SUCC_QUIZ, // succès : stocke les quizzes
      payload: { listQuizzes: res.data.quizzes || [] } // stocke dans listQuizzes
    });
  } catch (error) {
    dispatch({
      type: FAIL_QUIZ, // erreur lors de la récupération
      payload: error.response?.data?.message || error.message
    });
  }
};

// 🔹 Récupérer un quiz précis par ID
export const getQuiz = (quizId) => async (dispatch) => {
  dispatch({ type: LOAD_QUIZ }); // chargement
  try {
    const res = await axios.get(`/api/quiz/${quizId}`, getAuthConfig()); // fetch quiz
    dispatch({
      type: GET_QUIZ, // succès : stocke le quiz sélectionné
      payload: { quizToGet: res.data.quiz }
    });
  } catch (error) {
    dispatch({
      type: FAIL_QUIZ, // erreur
      payload: error.response?.data?.message || error.message
    });
  }
};

// 🔹 Marquer un quiz comme complété pour l'utilisateur
export const completeQuiz = (quizId) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/user/${quizId}/complete`, {}, getAuthConfig()); // POST pour compléter
    return res.data; // retourne les données de progression si besoin
  } catch (error) {
    console.error("Erreur completeQuiz:", error.response?.data?.message || error.message);
    throw error; // relance l'erreur pour la gestion ailleurs
  }
};

// 🔹 Ajouter un nouveau quiz
export const createQuiz = (newQuiz) => async (dispatch) => {
  try {
    await axios.post("/api/quiz/addquiz", newQuiz, getAuthConfig()); // envoie quiz au backend
    dispatch(getQuizzes(newQuiz.lessonId)); // recharge la liste des quizzes de la leçon
  } catch (error) {
    dispatch({ type: FAIL_QUIZ, payload: error.response?.data?.message || error.message });
  }
};

// 🔹 Supprimer un quiz
export const deleteQuiz = (id, lessonId) => async (dispatch) => {
  try {
    await axios.delete(`/api/quiz/${id}`, getAuthConfig()); // suppression backend
    dispatch(getQuizzes(lessonId)); // recharge la liste des quizzes
  } catch (error) {
    dispatch({ type: FAIL_QUIZ, payload: error.response?.data?.message || error.message });
  }
};

// 🔹 Modifier un quiz existant
export const editQuiz = (id, newQuiz, lessonId) => async (dispatch) => {
  try {
    await axios.put(`/api/quiz/${id}`, newQuiz, getAuthConfig()); // update backend
    dispatch(getQuizzes(lessonId)); // recharge la liste des quizzes
  } catch (error) {
    dispatch({ type: FAIL_QUIZ, payload: error.response?.data?.message || error.message });
  }
};
