import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProgress } from "../../JS/Actions/user";
import "./UserCard.css";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();

  // sécuriser userProgress[user._id]
  const progress = useSelector((state) =>
    user && state.userReducer.userProgress
      ? state.userReducer.userProgress[user._id]
      : null
  );

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserProgress(user._id));
    }
  }, [dispatch, user?._id]);

  return (
    <div className="user-card">
      <h3>{user?.name}</h3>
      <p>{user?.email}</p>
      <p>Phone: {user?.phone}</p>

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
