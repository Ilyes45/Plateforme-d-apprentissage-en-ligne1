import { FAIL_LESSON, GET_LESSON, LOAD_LESSON, SUCC_LESSON } from "../ActionsTypes/lesson";

// État initial du reducer pour les leçons
const initialState = {
  listLessons: [],     // Liste de toutes les leçons
  lessonToGet: {},     // Contient une leçon spécifique pour affichage ou édition
  load: false,         // Indique si une requête est en cours
  error: null,         // Contient un éventuel message d'erreur
};

const lessonReducer = (state = initialState, { type, payload }) => {
  switch (type) {

    // 🔹 Début d'une requête pour récupérer les leçons
    case LOAD_LESSON:
      return { ...state, load: true };

    // 🔹 Succès de récupération des leçons
    case SUCC_LESSON:
      return { ...state, load: false, listLessons: payload.listLessons };

    // 🔹 Échec lors de la récupération ou modification d'une leçon
    case FAIL_LESSON:
      return { ...state, load: false, error: payload };

    // 🔹 Récupération d'une seule leçon pour affichage ou édition
    case GET_LESSON:
      return { ...state, load: false, lessonToGet: payload.lessonToGet };

    // 🔹 Cas par défaut : retourne l'état actuel
    default:
      return state;
  }
};

export default lessonReducer;
