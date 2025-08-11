const isAdmin = async (req, res, next) => {
  try {
    // Check if the user is authenticated
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ msg: 'Access denied: Admins only' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server error in isAdmin middleware' });
  }
};

module.exports = isAdmin;
