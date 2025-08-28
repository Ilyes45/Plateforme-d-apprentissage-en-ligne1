import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, getUserProgress, deleteUser } from "../../JS/Actions/user";

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.userReducer.allUsers);
  const userProgress = useSelector((state) => state.userReducer.userProgress);
  const currentUser = useSelector((state) => state.userReducer.user);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users?.length > 0) {
      users.forEach((u) => dispatch(getUserProgress(u._id)));
    }
  }, [dispatch, users]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
    if (!confirmed) return;

    await dispatch(deleteUser(id, currentUser._id));
    dispatch(getAllUsers());
  };

  return (
    <div>
      <h2>Liste des utilisateurs</h2>
      {users?.map((u) => {
        const progress = userProgress[u._id] || { lessons: { completed: 0, total: 0 }, quizzes: { completed: 0, total: 0 }, courses: { completed: 0, total: 0 } };

        return (
          <div key={u._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h3>{u.name}</h3>
            <p>Email: {u.email}</p>
            <p>📚 Cours: {progress.courses?.completed}/{progress.courses?.total}</p>
            <p>📖 Leçons: {progress.lessons?.completed}/{progress.lessons?.total}</p>
            <p>📝 Quiz: {progress.quizzes?.completed}/{progress.quizzes?.total}</p>

            {currentUser?.role === "admin" && (
              <button
                style={{ marginTop: "10px", backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}
                onClick={() => handleDelete(u._id)}
              >
                Supprimer
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UserList;
