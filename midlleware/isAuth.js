// middleware/isAuth.js
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const isauth = async (req, res, next) => {
  try {
    // récupère directement le token (sans "Bearer")
    const token = req.headers["authorization"]; 

    if (!token) {
      req.user = null; 
      return next();
    }

    // vérifie le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = isauth;
