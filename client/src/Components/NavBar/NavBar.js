import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'; // 🔹 Composants Bootstrap pour la barre de navigation
import { useDispatch, useSelector } from 'react-redux'; // 🔹 Hooks Redux pour l'état global
import { Link } from 'react-router-dom'; // 🔹 Pour naviguer entre les pages
import { logout } from '../../JS/Actions/user'; // 🔹 Action pour déconnecter l'utilisateur
import './NavBar.css'; // 🔹 Styles personnalisés pour la barre

const NavBar = () => {
  const isAuth = useSelector((state) => state.userReducer.isAuth); // 🔹 Vérifie si l'utilisateur est connecté
  const user = useSelector((state) => state.userReducer.user);     // 🔹 Données de l'utilisateur courant
  const dispatch = useDispatch();                                   // 🔹 Permet de dispatcher des actions Redux

  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          {/* 🔹 Marque / logo du site */}
          <Navbar.Brand href="/">Coursy</Navbar.Brand>

          {/* 🔹 Liens de navigation à gauche */}
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            {isAuth && <Nav.Link href="/profile">Profile</Nav.Link>}
            {isAuth && <Nav.Link href="/cours">Cours</Nav.Link>}   
            {/* 🔹 Liens réservés aux admins */}
            {isAuth && user?.role === "admin" && <Nav.Link href="/add-course">AddCourse</Nav.Link>}
            {isAuth && user?.role === "admin" && <Nav.Link href="/admin/courses">Admin Course List</Nav.Link>}
            {isAuth && user?.role === "admin" && <Nav.Link href="/admin/users">Admin User List</Nav.Link>}
            {isAuth && user?.role === "admin" && <Nav.Link href="/admin/messages">Admin Messages</Nav.Link>}
          </Nav>

          {/* 🔹 Boutons à droite */}
          <div className="navbar-buttons">
            {isAuth ? (
              // 🔹 Bouton de déconnexion
              <Link to="/">
                <button className="logout" onClick={() => dispatch(logout())}>
                  Logout
                </button>
              </Link>
            ) : (
              // 🔹 Boutons Login / Register si non connecté
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
