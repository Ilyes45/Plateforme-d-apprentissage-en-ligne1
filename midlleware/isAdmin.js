const isAdmin = (req, res, next) => {
  try {
    // ⚠️ on suppose que `isauth` est déjà passé avant ce middleware
    // donc req.user est déjà rempli avec le user trouvé en BDD
    if (!req.user) {
      return res.status(401).send({ msg: "Unauthorized: No user found" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).send({ msg: "Access denied: Admins only!" });
    }

    next();
  } catch (error) {
    res.status(500).send({ msg: "Server error in isAdmin", error });
  }
};

module.exports = isAdmin;
