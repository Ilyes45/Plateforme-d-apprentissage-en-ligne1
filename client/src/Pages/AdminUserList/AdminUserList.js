import React, { useEffect } from 'react';
import UserList from '../../Components/UserList/UserList';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../JS/Actions/user';

const AdminUserList = () => {
  const dispatch = useDispatch();
  
  // Récupération des utilisateurs depuis le store Redux
  const users = useSelector((state) => state.userReducer.allUsers);

  // Au chargement du composant, on récupère tous les utilisateurs
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Affichage d'un message si les utilisateurs ne sont pas encore chargés
  if (!users || users.length === 0) {
    return <p>Chargement des utilisateurs...</p>;
  }

  return (
    <div>
      <h1>Admin User List</h1>
      {/* Affichage de la liste des utilisateurs
          Le composant UserList prend directement les users depuis le store */}
      <UserList />
    </div>
  );
};

export default AdminUserList;
