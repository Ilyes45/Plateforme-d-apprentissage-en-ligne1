import {combineReducers} from 'redux';
import userReducer from './user';
import courseReducer from './course';
import lessonReducer from './lesson';
import quizReducer from './quiz';

const rootReducer = combineReducers({userReducer,courseReducer,lessonReducer,quizReducer});

export default rootReducer;