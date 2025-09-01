import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages, deleteMessage, markAsRead } from "../../JS/Actions/message";
import "./AdminMessages.css";

const AdminMessages = () => {
  const dispatch = useDispatch();

  // Récupération des messages depuis le store Redux
  const { messages, loading, error } = useSelector((state) => state.messageReducer);

  // Au montage du composant, on récupère tous les messages
  useEffect(() => {
    dispatch(getMessages());
  }, [dispatch]);

  // Gestion de l'état de chargement et des erreurs
  if (loading) return <p style={{ textAlign: "center" }}>Chargement...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>Erreur: {error}</p>;

  return (
    <div className="admin-messages">
      <h1>📩 Messages reçus</h1>

      {/* Message si aucun n'est présent */}
      {messages.length === 0 && <p style={{ textAlign: "center" }}>Aucun message</p>}

      {/* Liste des messages */}
      {messages.map((msg) => (
        <div key={msg._id} className={`message-card ${msg.read ? 'read' : ''}`}>
          <p><strong>{msg.name}</strong> ({msg.email})</p>
          <p>{msg.content}</p>
          <small>{new Date(msg.createdAt).toLocaleString()}</small>

          {/* Boutons d'action pour chaque message */}
          <div className="msg-buttons">
            <button
              className="mark-read"
              onClick={() => dispatch(markAsRead(msg._id))}
            >
              ✔️ Marquer comme lu
            </button>
            <button
              className="delete"
              onClick={() => dispatch(deleteMessage(msg._id))}
            >
              🗑️ Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminMessages;
