import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { editUser, getUser } from '../../JS/Actions/user';
import './EditProfile.css'; // CSS spécifique au composant

const EditProfile = () => {
  const { id } = useParams(); // Récupère l'ID de l'utilisateur depuis l'URL
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook pour navigation

  // Récupère l'utilisateur depuis le store Redux
  const user = useSelector((state) => state.userReducer.user);

  // État local pour gérer les champs du formulaire
  const [updatedUser, setUpdatedUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  // État pour gérer l'image de profil
  const [image, setImage] = useState(null);

  // Charger l'utilisateur dès le montage du composant
  useEffect(() => {
    if (id) dispatch(getUser(id));
  }, [dispatch, id]);

  // Quand l'utilisateur est récupéré, remplir le formulaire avec ses données
  useEffect(() => {
    if (user) {
      setUpdatedUser({
        name: user.name || '',
        email: user.email || '',
        password: '', // mot de passe vide par défaut
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Met à jour les champs du formulaire
  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  // Gestion du fichier image
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Sauvegarder les modifications
  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', updatedUser.name);
    formData.append('email', updatedUser.email);
    formData.append('password', updatedUser.password);
    formData.append('phone', updatedUser.phone);
    if (image) formData.append('image', image); // si une image est choisie

    try {
      await dispatch(editUser(id, formData)); // Appel action Redux
      navigate('/profile'); // Redirige vers la page profil
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    }
  };

  // Annuler les modifications et revenir au profil
  const handleCancel = () => {
    navigate('/profile'); // Redirige sans enregistrer
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <h2>Edit Profile.</h2>
        <form onSubmit={handleSave} encType="multipart/form-data">
          {/* Champs texte pour nom, email, téléphone et mot de passe */}
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
          {/* Champ pour sélectionner une image */}
          <input type="file" name="image" onChange={handleFileChange} />

          {/* Boutons enregistrer / annuler */}
          <div className="button-group">
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
