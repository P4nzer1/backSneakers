exports.performAdminAction = (req, res) => {
  res.status(200).json({ success: true, message: 'Admin action performed' });
};