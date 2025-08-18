import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { editUser, getUser } from '../../JS/Actions/user';
import './EditProfile.css'; // Import du CSS

const EditProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.userReducer.user);

  const [updatedUser, setUpdatedUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    if (id) dispatch(getUser(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (user) {
      setUpdatedUser({
        name: user.name || '',
        email: user.email || '',
        password: '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', updatedUser.name);
    formData.append('email', updatedUser.email);
    formData.append('password', updatedUser.password);
    formData.append('phone', updatedUser.phone);
    if (image) formData.append('image', image);

    try {
      await dispatch(editUser(id, formData));
      navigate('/profile');
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    }
  };

  const handleCancel = () => {
    navigate('/profile'); // Redirige vers la page profil sans enregistrer
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <h2>Modifier le profil</h2>
        <form onSubmit={handleSave} encType="multipart/form-data">
          <input
            type="text"
            name="name"
            value={updatedUser.name}
            onChange={handleChange}
            placeholder="Nom"
          />
          <input
            type="email"
            name="email"
            value={updatedUser.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            value={updatedUser.password}
            onChange={handleChange}
            placeholder="Nouveau mot de passe"
          />
          <input
            type="text"
            name="phone"
            value={updatedUser.phone}
            onChange={handleChange}
            placeholder="Téléphone"
          />
          <input type="file" name="image" onChange={handleFileChange} />
          <div className="button-group">
            <button type="submit" className="btn-primary">Enregistrer</button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
