  import axios from 'axios';
import { SUCC_QUIZ, LOAD_QUIZ, FAIL_QUIZ, GET_QUIZ } from '../ActionsTypes/quiz';



// add quiz
export const createQuiz = (newQuiz) => async (dispatch) =>{
    try {
        const config ={
            headers:{
                authorization: localStorage.getItem("token"),
            },
        };
        await axios.post("/api/quiz/addquiz", newQuiz, config);
        dispatch(getQuizzes(newQuiz.lessonId));
    } catch (error) {
        dispatch({type : FAIL_QUIZ, payload: error.response?.data?.message || error.message});
    }
}

// delete quiz

export const deleteQuiz = (id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
    await axios.delete(`/api/quiz/${id}`, config);
    dispatch(getQuizzes());
  } catch (error) {
    dispatch({ type: FAIL_QUIZ, payload: error.response });
  }
};

// edit quiz

export const editQuiz = (id, newQuiz) => async (dispatch) => {
  try {
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
    await axios.put(`/api/quiz/${id}`, newQuiz, config);
    dispatch(getQuizzes());
  } catch (error) {
    console.error("Edit Quiz Error:", error.response?.data || error.message);
    dispatch({ type: FAIL_QUIZ, payload: error.response });
  }
};



// get one quiz



// Récupérer tous les quiz (optionnellement par lessonId)
export const getQuizzes = (lessonId) => async (dispatch) => {
  dispatch({ type: LOAD_QUIZ });
  try {
    let url = "/api/quiz";
    if (lessonId) url += `?lessonId=${lessonId}`;
    let result = await axios.get(url);
    dispatch({ type: SUCC_QUIZ, payload: { listQuizzes: result.data.quizzes } });
  } catch (error) {
    dispatch({ type: FAIL_QUIZ, payload: error.response?.data?.message || error.message });
  }
};

// Récupérer un quiz par ID
export const getQuiz = (id) => async (dispatch) => {
  dispatch({ type: LOAD_QUIZ });
  try {
    let result = await axios.get(`/api/quiz/${id}`);
    dispatch({ type: GET_QUIZ, payload: { quizToGet: result.data.quizToGet } });
  } catch (error) {
    dispatch({ type: FAIL_QUIZ, payload: error.response?.data?.message || error.message });
  }
};

// Complete quiz
export const completeQuiz = (quizId) => async (dispatch) => {
  try {
    const config = { headers: { authorization: localStorage.getItem("token") } };
    const response = await axios.post(`/api/user/${quizId}/complete`, {}, config);
    return response.data;
  } catch (error) {
    console.error("Erreur completeQuiz:", error.response?.data || error.message);
  }
};


