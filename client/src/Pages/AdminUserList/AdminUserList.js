import React, { useEffect } from 'react';
import UserList from '../../Components/UserList/UserList';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../JS/Actions/user';

const AdminUserList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.userReducer.allUsers);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  if (!users || users.length === 0) {
    return <p>Chargement des utilisateurs...</p>;
  }

  return (
    <div>
      <h1>Admin User List</h1>
      {/* On ne passe plus users en props, UserList prend les users directement depuis le store */}
      <UserList />
    </div>
  );
};

export default AdminUserList;
