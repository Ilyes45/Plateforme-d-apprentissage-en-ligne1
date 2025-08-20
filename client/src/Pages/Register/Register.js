import React from 'react'
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../../JS/Actions/user';
import './Register.css';

const Register = () => {
const[newUser, setUser] = useState({});
const [image, setImage] = useState(null);
const dispatch = useDispatch();
const navigate = useNavigate();

const handleChange = (e) => {
    setUser({ ...newUser, [e.target.name]: e.target.value });
  }
   
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  }

  const handleSubmit =  async(e) => {
    e.preventDefault();
    // Validation des champs
    if (!newUser.name || !newUser.email ||  !newUser.phone || !newUser.password  ) {
        alert("Veuillez remplir tous les champs !");
        return;
    }
     // Utilise FormData pour envoyer tous les champs + l'image
    const formData = new FormData();
    formData.append('name', newUser.name);
    formData.append('email', newUser.email);
    formData.append('phone', newUser.phone);
    formData.append('password', newUser.password);
    if (image) formData.append('image', image);

    const result = await dispatch(register(formData));
    if (result && result.payload && result.payload.message === "Email already exists") {
      alert(result.payload.message);
      return;
    }
    if (result && result.payload && result.payload.message === "User registered successfully") {
      navigate("/cours");
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
        <Form.Group className="mb-3" >
          <Form.Label>User Name</Form.Label>
          <Form.Control type="text" placeholder="Enter username" name="name" onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3" >
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" name="email" onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3" >
          <Form.Label>User Phone</Form.Label>
          <Form.Control type="number" placeholder="Enter phone number" name="phone" onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3" >
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" name="password" onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3" >
          <Form.Label>Photo</Form.Label>
          <Form.Control type="file" name="image" onChange={handleImageChange} />
        </Form.Group>
        <Form.Group className="mb-3" >
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Register
        </Button>
      </Form>
    </div>
  )
}

export default Register
