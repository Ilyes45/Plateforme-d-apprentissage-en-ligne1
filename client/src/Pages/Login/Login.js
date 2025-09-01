import React from 'react'
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../JS/Actions/user';
import './Login.css';

const Login = () => {

    const [user, setUser] = useState({}); // State pour stocker email et password
    const dispatch = useDispatch();       // Pour envoyer l'action Redux login
    const navigate = useNavigate();       // Pour rediriger après login

    // Fonction pour gérer la saisie dans les inputs
    const handelChange = async (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    // Fonction pour gérer le submit du formulaire
    const handeluser = async (e) => {
        e.preventDefault();

        // 🔹 Validation des champs
        if (!user.email || !user.password) {
            alert("Veuillez remplir tous les champs !");
            return;
        }

        // 🔹 Envoi de la requête login via Redux
        const result = await dispatch(login(user));

        // 🔹 Redirection si login réussi
        if (result && result.payload && result.payload.token) {
            navigate('/cours'); // redirige vers la page des cours
        } else {
            alert("Email ou mot de passe incorrect !");
        }

        // 🔹 Gestion des autres erreurs éventuelles
        if (result && result.payload && result.payload.message) {
            alert(result.payload.message);
        }
    }

    return (
        <div className="login-container">
          <h1>Login</h1>
          <Form>
            <Form.Group className="mb-3" >
              <Form.Label>Email address</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter email" 
                onChange={handelChange} 
                name="email" 
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" >
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                onChange={handelChange} 
                name="password" 
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              onClick={handeluser}
            >
              Se Connecter 
            </Button>
          </Form>
        </div>
    )
}

export default Login
