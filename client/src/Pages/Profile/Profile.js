import React from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const user = useSelector((state) => state.userReducer.user);
  const navigate = useNavigate();

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
        {/* Passe bien l'id dans l'URL */}
        <Button variant="primary" onClick={() => navigate(`/edit-profile/${user._id}`)}>
          Edit Profile
        </Button>
      </Card>
    </div>
  );
};

export default Profile;
