import {combineReducers} from 'redux';
import userReducer from './user';
import courseReducer from './course';
import lessonReducer from './lesson';

const rootReducer = combineReducers({userReducer,courseReducer,lessonReducer});

export default rootReducer;