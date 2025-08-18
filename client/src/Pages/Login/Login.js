
import React from 'react'
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../JS/Actions/user';
import './Login.css';


const Login = () => {

    const [user,setUser]= useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handelChange = async (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const handeluser = async (e) => {
        e.preventDefault();
        // Validation des champs
    if (!user.email || !user.password) {
        alert("Veuillez remplir tous les champs !");
        return;
    }
        const result = await dispatch(login(user));
        if (result && result.payload && result.payload.token) {
        navigate('/cours');
    } else {
        alert("Email ou mot de passe incorrect !");
    }
    // Gestion des autres erreurs
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
        <Form.Control type="email" placeholder="Enter email" onChange={handelChange} name="email" />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" >
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" onChange={handelChange} name="password" />
      </Form.Group>
      <Button variant="primary" type="submit" onClick={handeluser}>
        Se Connecter 
      </Button>
    </Form>
    </div>
  )
}

export default Login
