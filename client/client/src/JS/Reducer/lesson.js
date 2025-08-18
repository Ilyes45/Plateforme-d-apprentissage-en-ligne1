import { FAIL_LESSON, GET_LESSON, LOAD_LESSON, SUCC_LESSON } from "../ActionsTypes/lesson";

// import 



// inistate

const inistate={
    listLessons:[],
    error:null,
    load:false,
    lessonToGet:{},
};


// pure function

const lessonReducer =( state= inistate, {type,payload})=>{
    switch (type) {
        case LOAD_LESSON:
            return {...state, load:true};
        case SUCC_LESSON:
            return{...state,load:false, listLessons: payload.listLessons};
        case FAIL_LESSON:
            return{...state,load:false, error: payload};
        case GET_LESSON:
            return{...state,load:false, lessonToGet: payload.lessonToGet};
         default:
            return state;
    }
}

export default lessonReducer;