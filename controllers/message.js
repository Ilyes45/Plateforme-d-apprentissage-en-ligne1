const Message = require("../models/Message");

// ---------------- CREATE MESSAGE ----------------
// Create a new message (user may be logged in or not)
exports.createMessage = async (req, res) => {
  try {
    const { name, email, content } = req.body;

    // Build new message object
    const newMessage = new Message({
      name,
      email,
      content,
      user: req.user ? req.user._id : null, // link to logged user if exists
    });

    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- GET ALL MESSAGES ----------------
// ⚠️ Admin-only route: retrieve all messages
exports.getAllMessages = async (req, res) => {
  try {
    // Populate with user data (name, email)
    const messages = await Message.find().populate("user", "name email");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- DELETE MESSAGE ----------------
// Delete a message by its ID
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- MARK MESSAGE AS READ ----------------
// Mark a message as "read"
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    // Find message by ID
    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    // Set read flag to true (make sure 'read' field exists in model)
    message.read = true;
    await message.save();

    res.status(200).json({ message: "Message marked as read", message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
