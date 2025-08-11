import axios from 'axios';
import { CURRENT_USER, FAIL_USER, LOAD_USER, LOGOUT_USER, SUCC_USER } from '../ActionsTypes/user';


export const register = (formData) => async (dispatch) => {
    dispatch({type: LOAD_USER});
    try {
        let result = await axios.post("/api/user/register", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        dispatch({type : SUCC_USER, payload : result.data});
        return { payload: result.data };
    } catch (error) {
        dispatch({type : FAIL_USER, payload : error.response.data});
        return { payload: error.response.data };
    }
}

export const login = (user) => async (dispatch)=> {
    dispatch({type : LOAD_USER});
    try {
        let result =await axios.post("/api/user/login", user);
        dispatch({type : SUCC_USER , payload : result.data});
        return { payload: result.data }; 
    } catch (error) {
        dispatch({type : FAIL_USER , payload : error.response});
        return { payload: null };
    };
};

export const logout =() =>async(dispatch)=>{
    dispatch({ type:LOGOUT_USER});
};

export const current =() => async(dispatch)=>{
    dispatch({type:LOAD_USER});
    try {
        const config ={
            headers : {
                authorization : localStorage.getItem('token'),

            },

        };
        let result = await axios.get('/api/user/current',config);
        dispatch({ type : CURRENT_USER, payload : result.data});
    } catch (error) {
        dispatch({ type : FAIL_USER, payload : error.response});
        
    };
};

export const editUser = (id, updatedUser) => async (dispatch) => {
  try {
    const config = {
      headers: {
        authorization: localStorage.getItem("token"), // juste le token sans "Bearer "
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
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
    const result = await axios.get(`/api/user/${id}`, config);
    dispatch({ type: CURRENT_USER, payload: result.data });
  } catch (error) {
    dispatch({ type: FAIL_USER, payload: error.response });
  }
};
