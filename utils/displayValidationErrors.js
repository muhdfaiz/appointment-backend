const { validationResult } = require('express-validator')

/**
 * Display validation error
 *
 * @param {*} req
 * @param {*} res
 */
const displayValidationErrors = (req, res) => {
    // Validate inputs
    const errors = validationResult(req)

    // Display errors if validation failed.
    if (!errors.isEmpty()) {
        res.status(422).json({
            success: false,
            error: errors.array(),
        })
    }
}

module.exports = displayValidationErrors
