import React from 'react'
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../../JS/Actions/user';
import './Register.css';

const Register = () => {
  // 🔹 état pour stocker les infos du nouvel utilisateur
  const [newUser, setUser] = useState({});
  // 🔹 état pour stocker l'image sélectionnée
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 mise à jour des champs texte
  const handleChange = (e) => {
    setUser({ ...newUser, [e.target.name]: e.target.value });
  }

  // 🔹 capture de l'image uploadée
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  }

  // 🔹 soumission du formulaire
  const handleSubmit =  async(e) => {
    e.preventDefault();

    // 🔹 validation des champs obligatoires
    if (!newUser.name || !newUser.email ||  !newUser.phone || !newUser.password  ) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    // 🔹 création de FormData pour inclure l'image
    const formData = new FormData();
    formData.append('name', newUser.name);
    formData.append('email', newUser.email);
    formData.append('phone', newUser.phone);
    formData.append('password', newUser.password);
    if (image) formData.append('image', image);

    // 🔹 dispatch action Redux pour l'inscription
    const result = await dispatch(register(formData));

    // 🔹 gestion des réponses du serveur
    if (result && result.payload && result.payload.message === "Email already exists") {
      alert(result.payload.message);
      return;
    }
    if (result && result.payload && result.payload.message === "User registered successfully") {
      navigate("/cours"); // redirection vers la page cours
      return;
    }
    if (result && result.payload && result.payload.message) {
      alert(result.payload.message);
    }
  }

  return (
    <div className="register-container">
      <h1>Register</h1>
      <Form>
        {/* Champ nom */}
        <Form.Group className="mb-3" >
          <Form.Label>User Name</Form.Label>
          <Form.Control type="text" placeholder="Enter username" name="name" onChange={handleChange} />
        </Form.Group>

        {/* Champ email */}
        <Form.Group className="mb-3" >
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" name="email" onChange={handleChange} />
        </Form.Group>

        {/* Champ téléphone */}
        <Form.Group className="mb-3" >
          <Form.Label>User Phone</Form.Label>
          <Form.Control type="number" placeholder="Enter phone number" name="phone" onChange={handleChange} />
        </Form.Group>

        {/* Champ mot de passe */}
        <Form.Group className="mb-3" >
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" name="password" onChange={handleChange} />
        </Form.Group>

        {/* Champ photo */}
        <Form.Group className="mb-3" >
          <Form.Label>Photo</Form.Label>
          <Form.Control type="file" name="image" onChange={handleImageChange} />
        </Form.Group>

        {/* Checkbox optionnelle */}
        <Form.Group className="mb-3" >
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>

        {/* Bouton submit */}
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Register
        </Button>
      </Form>
    </div>
  )
}

export default Register
