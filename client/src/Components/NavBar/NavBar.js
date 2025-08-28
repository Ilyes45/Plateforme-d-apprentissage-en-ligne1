import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../JS/Actions/user';
import './NavBar.css';

const NavBar = () => {
  const isAuth = useSelector((state) => state.userReducer.isAuth);
  const user = useSelector((state) => state.userReducer.user);
  const dispatch = useDispatch();
  return (
    <div>
  <Navbar bg="dark" data-bs-theme="dark">
  <Container>
    <Navbar.Brand href="/">Coursy</Navbar.Brand>

    {/* Liens de navigation à gauche */}
    <Nav className="me-auto">
      <Nav.Link href="/">Home</Nav.Link>
      {isAuth && <Nav.Link href="/profile">Profile</Nav.Link>}
      {isAuth && <Nav.Link href="/cours">Cours</Nav.Link>}
      {isAuth && user?.role === "admin" && <Nav.Link href="/add-course">AddCourse</Nav.Link>}
      {isAuth && user?.role === "admin" && <Nav.Link href="/admin/courses">Admin Course List</Nav.Link>}
      {isAuth && user?.role === "admin" && <Nav.Link href="/admin/users">Admin User List</Nav.Link>}
      {isAuth && user?.role === "admin" && <Nav.Link href="/admin/messages">Admin Messages</Nav.Link>}
    </Nav>

    {/* Boutons à droite */}
    <div className="navbar-buttons">
      {isAuth ? (
        <Link to="/">
          <button className="logout" onClick={() => dispatch(logout())}>
            Logout
          </button>
        </Link>
      ) : (
        <>
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
          <Link to="/register">
            <button className="register-btn">Register</button>
          </Link>
        </>
      )}
    </div>
  </Container>
</Navbar>  
    </div>
  )
}

export default NavBar
