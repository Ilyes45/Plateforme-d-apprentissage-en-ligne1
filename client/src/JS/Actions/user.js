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

// ✅ helper sans "Bearer"
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: token } };
};

export const register = (formData) => async (dispatch) => {
  dispatch({ type: LOAD_USER });
  try {
    let result = await axios.post("/api/user/register", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    dispatch({ type: SUCC_USER, payload: result.data });
    return { payload: result.data };
  } catch (error) {
    dispatch({ type: FAIL_USER, payload: error.response.data });
    return { payload: error.response.data };
  }
};

export const login = (user) => async (dispatch) => {
  dispatch({ type: LOAD_USER });
  try {
    let result = await axios.post("/api/user/login", user);
    dispatch({ type: SUCC_USER, payload: result.data });
    return { payload: result.data }; 
  } catch (error) {
    dispatch({ type: FAIL_USER, payload: error.response });
    return { payload: null };
  }
};

export const logout = () => async (dispatch) => {
  dispatch({ type: LOGOUT_USER });
};

export const current = () => async (dispatch) => {
  dispatch({ type: LOAD_USER });
  try {
    const result = await axios.get("/api/user/current", getAuthConfig());
    dispatch({ type: CURRENT_USER, payload: result.data });
  } catch (error) {
    dispatch({ type: FAIL_USER, payload: error.response || error.message });
  }
};

export const editUser = (id, updatedUser) => async (dispatch) => {
  try {
    const config = {
      ...getAuthConfig(),
      headers: {
        ...getAuthConfig().headers,
        "Content-Type": "multipart/form-data",
      },
    };
    await axios.put(`/api/user/${id}`, updatedUser, config);
    dispatch(current()); // recharge user à jour
  } catch (error) {
    console.error("Edit User Error:", error.response?.data || error.message);
    dispatch({ type: FAIL_USER, payload: error.response });
  }
};

export const getUser = (id) => async (dispatch) => {
  dispatch({ type: LOAD_USER });
  try {
    const result = await axios.get(`/api/user/${id}`, getAuthConfig());
    dispatch({ type: CURRENT_USER, payload: result.data });
  } catch (error) {
    dispatch({ type: FAIL_USER, payload: error.response });
  }
};

export const completeLessonAction = (lessonId) => async (dispatch) => {
  try {
    const response = await axios.post(`/api/user/lesson/${lessonId}/complete`, {}, getAuthConfig());
    dispatch(current()); // recharge l'utilisateur pour mettre à jour completedLessons
    return response.data;
  } catch (error) {
    console.error("Erreur completeLessonAction:", error.response?.data || error.message);
  }
};

export const getAllUsers = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/user/", getAuthConfig());
    dispatch({ type: GET_ALL_USERS, payload: res.data });
  } catch (error) {
    console.error("Erreur getAllUsers:", error.response?.data || error.message);
  }
};


export const updateUser = (updatedUser) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/user/${updatedUser._id}`, updatedUser, getAuthConfig());
    dispatch({ type: GET_USER, payload: res.data }); // rafraîchir le user
  } catch (error) {
    dispatch({ type: USER_ERRORS, payload: error.response?.data || error.message });
  }
};
export const deleteUser = (id, currentUserId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };

    await axios.delete(`/api/user/${id}`, config);

    // Logout uniquement si l'utilisateur supprime son propre compte
    if (id === currentUserId) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch({ type: LOGOUT_USER });
    }

    return true; // suppression réussie
  } catch (error) {
    console.error("Delete User Error:", error.response?.data || error.message);
    dispatch({ type: FAIL_USER, payload: error.response?.data || error.message });
    return false;
  }
};

export const getUserProgress = (userId) => async (dispatch) => {
  try {
    const config = { headers: { Authorization: localStorage.getItem("token") } };
    const res = await axios.get(`/api/user/${userId}/progress`, config);

    dispatch({ 
      type: GET_USER_PROGRESS, 
      payload: { id: userId, progress: res.data.progress } // ✅ prendre uniquement progress
    });
  } catch (err) {
    dispatch({ type: FAIL_USER, payload: err.response?.data?.message || err.message });
  }
};
