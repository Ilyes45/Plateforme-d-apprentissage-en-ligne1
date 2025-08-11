import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../JS/Actions/user';
const NavBar = () => {
  const isAuth = useSelector((state) => state.userReducer.isAuth);
  const user = useSelector((state) => state.userReducer.user);
  const dispatch = useDispatch();
  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            
            {isAuth && <Nav.Link href="/profile">Profile</Nav.Link>}
            
            
            {isAuth &&<Nav.Link href="/cours">Cours</Nav.Link>}
            {isAuth && user?.role === "admin" &&<Nav.Link href="/add-course">AddCourse</Nav.Link>}
            <Nav className="">
            {isAuth ? (
              <Link to="/">
              <button className="logout" onClick={() => dispatch(logout())}>
                Logout
              </button></Link>
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
          </Nav>

            
          </Nav>
        </Container>
      </Navbar>
    </div>
  )
}

export default NavBar
