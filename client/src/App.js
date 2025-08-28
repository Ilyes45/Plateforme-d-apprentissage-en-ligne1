
import { Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './Components/NavBar/NavBar';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Profile from './Pages/Profile/Profile';
import Error from './Pages/Error';
import Register from './Pages/Register/Register';
import Cours from './Pages/Cours/Cours';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { current } from './JS/Actions/user';
import Addcourse from './Pages/AddCourse/Addcourse';
import EditCourse from './Pages/EditCourse/EditCourse';
import LessonList from './Components/LessonList/LessonList';
import AddLesson from './Pages/AddLesson/AddLesson';
import EditLesson from './Pages/EditLesson/EditLesson';
import LessonDetails from './Pages/LessonDetails/LessonDetails';
import EditProfile from './Pages/EditProfile/EditProfile';
import AddQuiz from './Pages/AddQuiz/AddQuiz';
import Quiz from './Pages/Quiz/Quiz';
import EditQuiz from './Pages/EditQuiz/EditQuiz';
import Footer from './Components/Footer/Footer';
import Contact from './Pages/Contact/Contact';
import Apropos from './Pages/Apropos/Apropos';
import AdminCourseList from './Pages/AdminCourseList/AdminCourseList';
import AdminUserList from './Pages/AdminUserList/AdminUserList';
import AdminMessages from './Pages/AdminMessages.js/AdminMessages';


function App() {
  const dispatch=useDispatch();
useEffect(()=>{
  if(localStorage.getItem('token')){
    dispatch(current())
      }
  },[dispatch]);

  return (
    <div className="App">
      <NavBar />
      
      <Routes>
  <Route path='/' element={<Home />} />
  <Route path='/register' element={<Register />} />
  <Route path='/login' element={<Login />} />
  <Route path='/profile' element={<Profile />} />
  <Route path="/edit-profile/:id" element={<EditProfile />} />

  <Route path='/cours' element={<Cours />} />
  <Route path='/add-course' element={<Addcourse />} />
  <Route path='/edit/:id' element={<EditCourse />} />

  <Route path="/course/:courseId/lessons" element={<LessonList />} />
<Route path="/add-lesson/:courseId" element={<AddLesson />} />
<Route path="/edit-lesson/:lessonId" element={<EditLesson />} />
<Route path="/lesson/:id" element={<LessonDetails />} />

<Route path="/course/:courseId/lesson/:lessonId/addquiz" element={<AddQuiz />} />
 <Route path="/quiz/:quizId" element={<Quiz />} />
 <Route path="/edit-quiz/:id" element={<EditQuiz />} />
 <Route path="/contact" element={<Contact />} />
        <Route path="/apropos" element={<Apropos />} />

        <Route path="/admin/courses" element={<AdminCourseList/>} />
        <Route path="/admin/users" element={<AdminUserList/>} />
        <Route path="/admin/messages" element={<AdminMessages/>} />

  <Route path='/*' element={<Error />} />
</Routes>
<Footer />
    </div>
  );
}

export default App;
