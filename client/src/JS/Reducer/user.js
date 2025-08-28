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

const initialState = {
  user: null,
  loadUser: false,
  errors: [],
  isAuth: false,
  allUsers: [],
  userProgress: {},
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_USER:
      return { ...state, loadUser: true };

    case SUCC_USER:
      localStorage.setItem("token", payload.token);
      return { ...state, loadUser: false, user: payload.user, isAuth: true, errors: [] };

    case FAIL_USER:
      return { ...state, loadUser: false, errors: payload, isAuth: false };

    case CURRENT_USER:
      return { ...state, loadUser: false, user: payload, isAuth: true, errors: [] };

    case GET_ALL_USERS:
      return { ...state, loadUser: false, allUsers: payload.users || payload };

    case LOGOUT_USER:
      localStorage.removeItem("token");
      return { ...state, loadUser: false, user: null, errors: [], isAuth: false };

    case GET_USER:
      return { ...state, loadUser: false, user: payload, isAuth: true };

    case USER_ERRORS:
      return { ...state, loadUser: false, errors: [...state.errors, payload] };

   case GET_USER_PROGRESS:
  return {
    ...state,
    userProgress: { 
      ...state.userProgress, 
      [payload.id]: payload.progress // stocké par userId
    },
  };
    case UPDATE_USER_PROGRESS:
      return { ...state, userProgress: payload };

    default:
      return state;
  }
};

export default userReducer;
