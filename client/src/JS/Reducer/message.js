import {
  LOAD_MESSAGES, GET_MESSAGES, FAIL_MESSAGES,
  DELETE_MESSAGE, MARK_AS_READ
} from "../ActionsTypes/message";

// État initial du reducer pour les messages
const initialState = {
  messages: [],    // Liste de tous les messages reçus
  loading: false,  // Indique si une requête est en cours
  error: null,     // Contient un éventuel message d'erreur
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {

    // 🔹 Début d'une requête de récupération des messages
    case LOAD_MESSAGES:
      return { ...state, loading: true };

    // 🔹 Succès de récupération des messages
    case GET_MESSAGES:
      return { ...state, loading: false, messages: action.payload };

    // 🔹 Échec de la récupération des messages
    case FAIL_MESSAGES:
      return { ...state, loading: false, error: action.payload };

    // 🔹 Suppression d'un message spécifique
    case DELETE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter(msg => msg._id !== action.payload)
      };

    // 🔹 Marquer un message comme lu
    case MARK_AS_READ:
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg._id === action.payload ? { ...msg, read: true } : msg
        )
      };

    // 🔹 Cas par défaut : renvoie l'état actuel
    default:
      return state;
  }
};

export default messageReducer;
