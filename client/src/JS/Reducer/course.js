import {
  FAIL_COURSE,
  GET_COURSES,
  GET_COURSE,
  LOAD_COURSE,
  SUCC_COURSE,
  ASSIGN_COURSE,
  UNASSIGN_COURSE_SUCCESS,
  COMPLETE_COURSE,
} from "../ActionsTypes/course";

const initialState = {
  listCourses: [],
  courseToGet: {},
  load: false,
  error: null,
};

const courseReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_COURSE:
      return { ...state, load: true };

    case SUCC_COURSE:
      return { ...state, load: false, error: null };

    case FAIL_COURSE:
      return { ...state, load: false, error: payload };

    case GET_COURSES:
      return { ...state, load: false, listCourses: payload };

    case GET_COURSE:
      return { ...state, load: false, courseToGet: payload };

    case ASSIGN_COURSE:
    case UNASSIGN_COURSE_SUCCESS:
      return {
        ...state,
        listCourses: state.listCourses.map(course =>
          course._id === payload._id ? payload : course
        ),
        load: false,
        error: null,
      };

    case COMPLETE_COURSE:
      return {
        ...state,
        user: { ...state.user, completedCourses: payload },
      };

    default:
      return state;
  }
};

export default courseReducer;
