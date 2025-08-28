import React from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { deleteUser } from '../../JS/Actions/user';

const Profile = () => {
  const user = useSelector((state) => state.userReducer.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    const success = await dispatch(deleteUser(user._id));
    if (success) {
      navigate('/'); // redirige vers la page d'accueil
    }
  };

  return (
    <div className='profile'>
      <h1>User Profile</h1>
      <Card className="profile-card">
        <Card.Img
          variant="top"
          src={user?.image || "https://placehold.co/180"}
          alt="Profile"
        />
        <ListGroup variant="flush">
          <ListGroup.Item>{user?.name}</ListGroup.Item>
          <ListGroup.Item>{user?.email}</ListGroup.Item>
          <ListGroup.Item>{user?.phone}</ListGroup.Item>
        </ListGroup>
        <Button variant="primary" onClick={() => navigate(`/edit-profile/${user._id}`)}>
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
