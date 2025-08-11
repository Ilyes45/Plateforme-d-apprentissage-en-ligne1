import { FAIL_COURSE, GET_COURSE, LOAD_COURSE, SUCC_COURSE } from "../ActionsTypes/course";

// import 



// inistate

const inistate={
    listCourses:[],
    error:null,
    load:false,
    courseToGet:{},
};


// pure function

const courseReducer =( state= inistate, {type,payload})=>{
    switch (type) {
        case LOAD_COURSE:
            return {...state, load:true};
        case SUCC_COURSE:
            return{...state,load:false, listCourses: payload.listCourses};
        case FAIL_COURSE:
            return{...state,load:false, errors: payload};
        case GET_COURSE:
            return{...state,load:false, courseToGet: payload.courseToGet};
         default:
            return state;
    }
}

export default courseReducer;