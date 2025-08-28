import { LOAD_QUIZ, SUCC_QUIZ, FAIL_QUIZ, GET_QUIZ } from "../ActionsTypes/quiz";

const initialState = {
  listQuizzes: [],
  quizToGet: null,
  load: false,
  error: null,
};

const quizReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_QUIZ:
      return { ...state, load: true, error: null };

    case SUCC_QUIZ:
      return {
        ...state,
        load: false,
        listQuizzes: payload.listQuizzes || [],
        error: null
      };

    case GET_QUIZ:
      return {
        ...state,
        load: false,
        quizToGet: payload.quizToGet,
        error: null
      };

    case FAIL_QUIZ:
      return { ...state, load: false, error: payload };

    default:
      return state;
  }
};

export default quizReducer;
