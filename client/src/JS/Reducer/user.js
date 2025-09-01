import { 
  CURRENT_USER, 
  FAIL_USER, 
  GET_ALL_USERS, 
  GET_USER, 
  GET_USER_PROGRESS, 
  LOAD_USER, 
  LOGOUT_USER, 
  SUCC_USER, 
  UPDATE_USER_PROGRESS, 
  USER_ERRORS
} from "../ActionsTypes/user";

// État initial du reducer
const initialState = {
  user: null,           // l'utilisateur connecté
  loadUser: false,      // état de chargement
  errors: [],           // liste des erreurs
  isAuth: false,        // authentification
  allUsers: [],         // liste de tous les utilisateurs (admin)
  userProgress: {},     // progression des utilisateurs (par userId)
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {

    // 🔹 Début du chargement d'une action utilisateur
    case LOAD_USER:
      return { ...state, loadUser: true };

    // 🔹 Succès d'une action (login, signup)
    case SUCC_USER:
      localStorage.setItem("token", payload.token); // sauvegarde du token
      return { 
        ...state, 
        loadUser: false, 
        user: payload.user, 
        isAuth: true, 
        errors: [] 
      };

    // 🔹 Échec d'une action utilisateur
    case FAIL_USER:
      return { ...state, loadUser: false, errors: payload, isAuth: false };

    // 🔹 Récupération des informations du current user
    case CURRENT_USER:
      return { ...state, loadUser: false, user: payload, isAuth: true, errors: [] };

    // 🔹 Récupération de tous les utilisateurs (admin)
    case GET_ALL_USERS:
      return { ...state, loadUser: false, allUsers: payload.users || payload };

    // 🔹 Déconnexion de l'utilisateur
    case LOGOUT_USER:
      localStorage.removeItem("token");
      return { ...state, loadUser: false, user: null, errors: [], isAuth: false };

    // 🔹 Récupération d'un utilisateur spécifique
    case GET_USER:
      return { ...state, loadUser: false, user: payload, isAuth: true };

    // 🔹 Gestion des erreurs spécifiques
    case USER_ERRORS:
      return { ...state, loadUser: false, errors: [...state.errors, payload] };

    // 🔹 Récupération de la progression d'un utilisateur
    case GET_USER_PROGRESS:
      return {
        ...state,
        userProgress: { 
          ...state.userProgress, 
          [payload.id]: payload.progress // stockée par userId
        },
      };

    // 🔹 Mise à jour de la progression globale
    case UPDATE_USER_PROGRESS:
      return { ...state, userProgress: payload };

    // 🔹 Cas par défaut (pas de modification)
    default:
      return state;
  }
};

export default userReducer;
