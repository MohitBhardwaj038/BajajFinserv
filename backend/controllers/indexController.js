/**
 * @desc    Welcome / health-check endpoint
 * @route   GET /api
 * @access  Public
 */
const getWelcome = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Chitkara Full Stack Challenge API is running',
  });
};

module.exports = {
  getWelcome,
};
