import axios from "axios";
import {
  LOAD_MESSAGES, GET_MESSAGES, FAIL_MESSAGES, DELETE_MESSAGE, MARK_AS_READ
} from "../ActionsTypes/message";

// 🔹 Récupérer tous les messages
export const getMessages = () => async (dispatch) => {
  dispatch({ type: LOAD_MESSAGES }); // indique que le chargement commence
  try {
    const token = localStorage.getItem("token"); // récupération du token pour l'authentification
    const res = await axios.get("http://localhost:3000/api/messages", {
      headers: { Authorization: token }, // en-tête Authorization
    });
    dispatch({ type: GET_MESSAGES, payload: res.data }); // succès : stocke les messages dans le reducer
  } catch (err) {
    // échec : stocke l'erreur dans le reducer
    dispatch({ type: FAIL_MESSAGES, payload: err.response?.data?.message || err.message });
  }
};

// 🔹 Supprimer un message par son ID
export const deleteMessage = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token"); // récupération du token
    await axios.delete(`http://localhost:3000/api/messages/${id}`, {
      headers: { Authorization: token },
    });
    dispatch({ type: DELETE_MESSAGE, payload: id }); // succès : supprime le message du state
  } catch (err) {
    console.error(err); // erreur côté front seulement (pas dispatché)
  }
};

// 🔹 Marquer un message comme lu
export const markAsRead = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token"); // token d'authentification
    const res = await axios.put(`http://localhost:3000/api/messages/read/${id}`, {}, {
      headers: { Authorization: token },
    });
    // succès : met à jour le message dans le state en ajoutant `read: true`
    dispatch({ type: MARK_AS_READ, payload: res.data.message._id });
  } catch (err) {
    console.error(err); // erreur côté front seulement
  }
};
