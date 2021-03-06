const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../../../utils/errorResponse')
const User = require('../models/user.model')

/**
 * Middleware to check access token present and valid.
 */
exports.auth = asyncHandler(async (req, res, next) => {
    let token
    console.log(req.headers)
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }

    // Make sure token exists
    if (!token) {
        return next(
            new ErrorResponse('Not authorized to access this route', 401)
        )
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decoded.id)

        next()
    } catch (err) {
        return next(
            new ErrorResponse('Not authorized to access this route', 401)
        )
    }
})
