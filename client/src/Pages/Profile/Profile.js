import React from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { deleteUser } from '../../JS/Actions/user';

const Profile = () => {
  // 🔹 récupération de l'utilisateur depuis Redux
  const user = useSelector((state) => state.userReducer.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔹 suppression de l'utilisateur
  const handleDelete = async () => {
    const success = await dispatch(deleteUser(user._id));
    if (success) {
      navigate('/'); // redirige vers la page d'accueil après suppression
    }
  };

  return (
    <div className='profile'>
      <h1>User Profile</h1>
      <Card className="profile-card">
        {/* 🔹 image de profil */}
        <Card.Img
          variant="top"
          src={user?.image || "https://placehold.co/180"} // image par défaut si non définie
          alt="Profile"
        />
        {/* 🔹 informations de l'utilisateur */}
        <ListGroup variant="flush">
          <ListGroup.Item>{user?.name}</ListGroup.Item>
          <ListGroup.Item>{user?.email}</ListGroup.Item>
          <ListGroup.Item>{user?.phone}</ListGroup.Item>
        </ListGroup>
        {/* 🔹 boutons pour éditer et supprimer le profil */}
        <Button 
          variant="primary" 
          onClick={() => navigate(`/edit-profile/${user._id}`)}
        >
          Edit Profile
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Supprimer
        </Button>
      </Card>
    </div>
  );
};

export default Profile;
