import {combineReducers} from 'redux';
import userReducer from './user';
import courseReducer from './course';
import lessonReducer from './lesson';
import quizReducer from './quiz';
import messageReducer from './message';

const rootReducer = combineReducers({userReducer,courseReducer,lessonReducer,quizReducer,messageReducer});

export default rootReducer;