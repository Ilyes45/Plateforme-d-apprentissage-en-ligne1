import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { editUser, getUser } from '../../JS/Actions/user';

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
    if (id) {
      dispatch(getUser(id));
    }
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

  return (
    <div className="edit-user">
      <h2>Edit User</h2>
      <form onSubmit={handleSave} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          value={updatedUser.name}
          onChange={handleChange}
          placeholder="Name"
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
          placeholder="New Password"
        />
        <input
          type="text"
          name="phone"
          value={updatedUser.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
        <input type="file" name="image" onChange={handleFileChange} />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
