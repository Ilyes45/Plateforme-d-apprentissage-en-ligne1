import axios from "axios";
import {
  LOAD_MESSAGES, GET_MESSAGES, FAIL_MESSAGES, DELETE_MESSAGE, MARK_AS_READ
} from "../ActionsTypes/message";

export const getMessages = () => async (dispatch) => {
  dispatch({ type: LOAD_MESSAGES });
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:3000/api/messages", {
      headers: { Authorization: token },
    });
    dispatch({ type: GET_MESSAGES, payload: res.data });
  } catch (err) {
    dispatch({ type: FAIL_MESSAGES, payload: err.response?.data?.message || err.message });
  }
};

export const deleteMessage = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:3000/api/messages/${id}`, {
      headers: { Authorization: token },
    });
    dispatch({ type: DELETE_MESSAGE, payload: id });
  } catch (err) {
    console.error(err);
  }
};

export const markAsRead = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(`http://localhost:3000/api/messages/read/${id}`, {}, {
      headers: { Authorization: token },
    });
    dispatch({ type: MARK_AS_READ, payload: res.data.message._id });
  } catch (err) {
    console.error(err);
  }
};
