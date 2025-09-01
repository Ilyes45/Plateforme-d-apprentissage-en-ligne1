import { LOAD_QUIZ, SUCC_QUIZ, FAIL_QUIZ, GET_QUIZ } from "../ActionsTypes/quiz";

// État initial du reducer
const initialState = {
  listQuizzes: [],    // liste de tous les quiz
  quizToGet: null,    // quiz spécifique sélectionné pour édition ou affichage
  load: false,        // état de chargement
  error: null,        // message d'erreur
};

const quizReducer = (state = initialState, { type, payload }) => {
  switch (type) {

    // 🔹 Début d'une requête quiz (loading)
    case LOAD_QUIZ:
      return { ...state, load: true, error: null };

    // 🔹 Succès de la récupération de la liste des quiz
    case SUCC_QUIZ:
      return {
        ...state,
        load: false,
        listQuizzes: payload.listQuizzes || [], // mise à jour de la liste
        error: null
      };

    // 🔹 Récupération d'un quiz spécifique (pour édition)
    case GET_QUIZ:
      return {
        ...state,
        load: false,
        quizToGet: payload.quizToGet,
        error: null
      };

    // 🔹 Gestion d'une erreur sur une action quiz
    case FAIL_QUIZ:
      return { ...state, load: false, error: payload };

    // 🔹 Cas par défaut (pas de modification)
    default:
      return state;
  }
};

export default quizReducer;
