import axios from 'axios';
import { 
  CURRENT_USER, 
  FAIL_USER, 
  GET_ALL_USERS, 
  GET_USER, 
  GET_USER_PROGRESS, 
  LOAD_USER, 
  LOGOUT_USER, 
  SUCC_USER, 
  USER_ERRORS
} from '../ActionsTypes/user';

// ✅ helper pour configurer l'autorisation avec le token stocké dans localStorage
const getAuthConfig = () => {
  const token = localStorage.getItem("token"); // récupère le token
  return { headers: { Authorization: token } };  // retourne la config axios
};

// Action pour enregistrer un nouvel utilisateur
export const register = (formData) => async (dispatch) => {
  dispatch({ type: LOAD_USER }); // indique que le chargement commence
  try {
    let result = await axios.post("/api/user/register", formData, {
      headers: { 'Content-Type': 'multipart/form-data' } // envoi des données en multipart/form-data
    });
    dispatch({ type: SUCC_USER, payload: result.data }); // succès : stocke l'utilisateur et token
    return { payload: result.data }; // retourne les données pour un usage éventuel
  } catch (error) {
    dispatch({ type: FAIL_USER, payload: error.response.data }); // en cas d'erreur
    return { payload: error.response.data };
  }
};

// Action pour la connexion
export const login = (user) => async (dispatch) => {
  dispatch({ type: LOAD_USER }); // chargement en cours
  try {
    let result = await axios.post("/api/user/login", user); // envoi des identifiants
    dispatch({ type: SUCC_USER, payload: result.data }); // succès : stockage du user et token
    return { payload: result.data }; 
  } catch (error) {
    dispatch({ type: FAIL_USER, payload: error.response }); // erreur login
    return { payload: null };
  }
};

// Déconnexion de l'utilisateur
export const logout = () => async (dispatch) => {
  dispatch({ type: LOGOUT_USER }); // supprime user et token
};

// Récupérer les infos de l'utilisateur courant
export const current = () => async (dispatch) => {
  dispatch({ type: LOAD_USER }); // chargement en cours
  try {
    const result = await axios.get("/api/user/current", getAuthConfig()); // fetch user courant
    dispatch({ type: CURRENT_USER, payload: result.data }); // succès : stocke user
  } catch (error) {
    dispatch({ type: FAIL_USER, payload: error.response || error.message }); // erreur fetch
  }
};

// Editer les informations d'un utilisateur
export const editUser = (id, updatedUser) => async (dispatch) => {
  try {
    const config = {
      ...getAuthConfig(),
      headers: {
        ...getAuthConfig().headers,
        "Content-Type": "multipart/form-data", // pour envoyer fichiers/images
      },
    };
    await axios.put(`/api/user/${id}`, updatedUser, config); // envoi de la mise à jour
    dispatch(current()); // recharge les infos de l'utilisateur
  } catch (error) {
    console.error("Edit User Error:", error.response?.data || error.message);
    dispatch({ type: FAIL_USER, payload: error.response });
  }
};

// Récupérer un utilisateur spécifique par id
export const getUser = (id) => async (dispatch) => {
  dispatch({ type: LOAD_USER });
  try {
    const result = await axios.get(`/api/user/${id}`, getAuthConfig());
    dispatch({ type: CURRENT_USER, payload: result.data }); // stocke l'utilisateur
  } catch (error) {
    dispatch({ type: FAIL_USER, payload: error.response });
  }
};

// Marquer une leçon comme complétée
export const completeLessonAction = (lessonId) => async (dispatch) => {
  try {
    const response = await axios.post(`/api/user/lesson/${lessonId}/complete`, {}, getAuthConfig());
    dispatch(current()); // recharge user pour mettre à jour les leçons complétées
    return response.data;
  } catch (error) {
    console.error("Erreur completeLessonAction:", error.response?.data || error.message);
  }
};

// Récupérer tous les utilisateurs (admin)
export const getAllUsers = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/user/", getAuthConfig());
    dispatch({ type: GET_ALL_USERS, payload: res.data });
  } catch (error) {
    console.error("Erreur getAllUsers:", error.response?.data || error.message);
  }
};

// Mettre à jour un utilisateur (admin)
export const updateUser = (updatedUser) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/user/${updatedUser._id}`, updatedUser, getAuthConfig());
    dispatch({ type: GET_USER, payload: res.data }); // rafraîchir les infos de l'utilisateur
  } catch (error) {
    dispatch({ type: USER_ERRORS, payload: error.response?.data || error.message });
  }
};

// Supprimer un utilisateur
export const deleteUser = (id, currentUserId) => async (dispatch) => {
  try {
    const config = {
      headers: { Authorization: localStorage.getItem("token") },
    };

    await axios.delete(`/api/user/${id}`, config); // suppression

    // Déconnexion si l'utilisateur supprime son propre compte
    if (id === currentUserId) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch({ type: LOGOUT_USER });
    }

    return true; // succès
  } catch (error) {
    console.error("Delete User Error:", error.response?.data || error.message);
    dispatch({ type: FAIL_USER, payload: error.response?.data || error.message });
    return false;
  }
};

// Récupérer le progrès d'un utilisateur
export const getUserProgress = (userId) => async (dispatch) => {
  try {
    const config = { headers: { Authorization: localStorage.getItem("token") } };
    const res = await axios.get(`/api/user/${userId}/progress`, config);

    dispatch({ 
      type: GET_USER_PROGRESS, 
      payload: { id: userId, progress: res.data.progress } // stocke uniquement le progrès
    });
  } catch (err) {
    dispatch({ type: FAIL_USER, payload: err.response?.data?.message || err.message });
  }
};
