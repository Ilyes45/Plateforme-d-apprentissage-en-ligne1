import {
  LOAD_MESSAGES, GET_MESSAGES, FAIL_MESSAGES,
  DELETE_MESSAGE, MARK_AS_READ
} from "../ActionsTypes/message";

const initialState = {
  messages: [],
  loading: false,
  error: null,
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_MESSAGES:
      return { ...state, loading: true };
    case GET_MESSAGES:
      return { ...state, loading: false, messages: action.payload };
    case FAIL_MESSAGES:
      return { ...state, loading: false, error: action.payload };
    case DELETE_MESSAGE:
      return { ...state, messages: state.messages.filter(msg => msg._id !== action.payload) };
    case MARK_AS_READ:
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg._id === action.payload ? { ...msg, read: true } : msg
        )
      };
    default:
      return state;
  }
};

export default messageReducer;
