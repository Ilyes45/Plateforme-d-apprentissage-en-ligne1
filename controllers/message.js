const Message = require("../models/Message");

exports.createMessage = async (req, res) => {
  try {
    const { name, email, content } = req.body;
    const newMessage = new Message({
      name,
      email,
      content,
      user: req.user ? req.user._id : null, // si user connecté
    });
    await newMessage.save();
    res.status(201).json({ message: "Message envoyé avec succès", newMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ⚠️ route réservée à l’admin
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate("user", "name email");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.status(200).json({ message: "Message supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ message: "Message introuvable" });

    message.read = true; // tu peux ajouter ce champ dans le modèle Message
    await message.save();

    res.status(200).json({ message: "Message marqué comme lu", message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};