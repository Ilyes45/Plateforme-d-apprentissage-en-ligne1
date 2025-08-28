const express = require("express");
const { createMessage, getAllMessages, deleteMessage, markAsRead } = require("../controllers/message");
const isAdmin = require("../midlleware/isAdmin");
const isauth = require("../midlleware/isAuth");

const router = express.Router();

router.post("/", createMessage); // accessible à tous
router.get("/",isauth, isAdmin, getAllMessages); // seulement admin
router.delete("/:id", isauth, isAdmin, deleteMessage); // supprimer message
router.put("/read/:id", isauth, isAdmin, markAsRead); // marquer comme lu

module.exports = router;
