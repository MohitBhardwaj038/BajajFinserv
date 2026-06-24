const { USER_ID, EMAIL_ID, COLLEGE_ROLL_NUMBER } = require('../config/constants');
const { processEdges } = require('../utils/bfhlUtils');

/**
 * @desc    Process directed edges and build hierarchies
 * @route   POST /api/bfhl
 * @access  Public
 */
const postBfhl = (req, res, next) => {
  try {
    const { data } = req.body;

    // Validate that `data` exists and is an array
    if (!data || !Array.isArray(data)) {
      const error = new Error('"data" must be a non-empty array of edge strings');
      error.statusCode = 400;
      throw error;
    }

    const result = processEdges(data);

    return res.status(200).json({
      user_id: USER_ID,
      email_id: EMAIL_ID,
      college_roll_number: COLLEGE_ROLL_NUMBER,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { postBfhl };
