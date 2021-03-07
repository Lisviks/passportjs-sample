exports.protect = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ msg: 'not logged in' });
  }
  next();
};
