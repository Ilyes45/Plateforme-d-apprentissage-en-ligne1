import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages, deleteMessage, markAsRead } from "../../JS/Actions/message";
import "./AdminMessages.css";

const AdminMessages = () => {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.messageReducer);

  useEffect(() => { dispatch(getMessages()); }, [dispatch]);

  if (loading) return <p style={{ textAlign: "center" }}>Chargement...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>Erreur: {error}</p>;

  return (
    <div className="admin-messages">
      <h1>📩 Messages reçus</h1>
      {messages.length === 0 && <p style={{ textAlign: "center" }}>Aucun message</p>}

      {messages.map((msg) => (
        <div key={msg._id} className={`message-card ${msg.read ? 'read' : ''}`}>
          <p><strong>{msg.name}</strong> ({msg.email})</p>
          <p>{msg.content}</p>
          <small>{new Date(msg.createdAt).toLocaleString()}</small>

          <div className="msg-buttons">
            <button className="mark-read" onClick={() => dispatch(markAsRead(msg._id))}>
              ✔️ Marquer comme lu
            </button>
            <button className="delete" onClick={() => dispatch(deleteMessage(msg._id))}>
              🗑️ Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminMessages;
