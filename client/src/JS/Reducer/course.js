import {
  FAIL_COURSE,
  GET_COURSES,
  GET_COURSE,
  LOAD_COURSE,
  SUCC_COURSE,
  ASSIGN_COURSE,
  UNASSIGN_COURSE_SUCCESS,
  COMPLETE_COURSE,
} from "../ActionsTypes/course";

// État initial du reducer pour les cours
const initialState = {
  listCourses: [],     // Liste de tous les cours
  courseToGet: {},     // Contient un cours spécifique pour affichage ou édition
  load: false,         // Indique si une requête est en cours
  error: null,         // Contient un éventuel message d'erreur
};

const courseReducer = (state = initialState, { type, payload }) => {
  switch (type) {

    // 🔹 Début d'une requête pour les cours
    case LOAD_COURSE:
      return { ...state, load: true };

    // 🔹 Succès générique d'une requête liée au cours (pas de payload spécifique)
    case SUCC_COURSE:
      return { ...state, load: false, error: null };

    // 🔹 Échec d'une action sur les cours
    case FAIL_COURSE:
      return { ...state, load: false, error: payload };

    // 🔹 Récupération de tous les cours
    case GET_COURSES:
      return { ...state, load: false, listCourses: payload };

    // 🔹 Récupération d'un cours spécifique
    case GET_COURSE:
      return { ...state, load: false, courseToGet: payload };

    // 🔹 Assignation ou désassignation d'un cours à un utilisateur
    case ASSIGN_COURSE:
    case UNASSIGN_COURSE_SUCCESS:
      return {
        ...state,
        listCourses: state.listCourses.map(course =>
          course._id === payload._id ? payload : course
        ),
        load: false,
        error: null,
      };

    // 🔹 Marquer un cours comme terminé pour l'utilisateur
    case COMPLETE_COURSE:
      return {
        ...state,
        user: { ...state.user, completedCourses: payload },
      };

    // 🔹 Cas par défaut : retourne l'état actuel
    default:
      return state;
  }
};

export default courseReducer;
