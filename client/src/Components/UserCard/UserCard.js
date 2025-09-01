import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProgress } from "../../JS/Actions/user";
import "./UserCard.css";

// 🔹 Composant pour afficher les informations et la progression d'un utilisateur
const UserCard = ({ user }) => {
  const dispatch = useDispatch();

  // 🔹 Récupérer la progression de l'utilisateur depuis Redux
  // 🔹 Vérifie que 'user' et 'userProgress' existent pour éviter les erreurs
  const progress = useSelector((state) =>
    user && state.userReducer.userProgress
      ? state.userReducer.userProgress[user._id]
      : null
  );

  // 🔹 useEffect pour récupérer la progression quand le composant monte
  useEffect(() => {
    if (user?._id) {
      dispatch(getUserProgress(user._id)); // fetch API user progress
    }
  }, [dispatch, user?._id]);

  return (
    <div className="user-card">
      {/* 🔹 Informations de base de l'utilisateur */}
      <h3>{user?.name}</h3>
      <p>{user?.email}</p>
      <p>Phone: {user?.phone}</p>

      {/* 🔹 Affichage de la progression si disponible, sinon message de chargement */}
      {progress ? (
        <>
          <p><strong>Cours:</strong> {progress.courses.completed}/{progress.courses.total}</p>
          <p><strong>Leçons:</strong> {progress.lessons.completed}/{progress.lessons.total}</p>
          <p><strong>Quiz:</strong> {progress.quizzes.completed}/{progress.quizzes.total}</p>
        </>
      ) : (
        <p>Chargement progression...</p>
      )}
    </div>
  );
};

export default UserCard;
