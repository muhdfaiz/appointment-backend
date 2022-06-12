const asyncHandler = require('../middleware/async')
const { validationResult } = require('express-validator')
const AppointmentService = require('../services/appointment.service')

// @desc      Get all appointments belongs to the user
// @route     GET /api/v1/user/{id}/appointments/
// @access    Private
exports.getUserAppointments = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query

    const { metadata, appointments } =
        await AppointmentService.getUserAppointments(
            req.user.id,
            page,
            limit,
            search
        )

    res.status(200).json({
        success: true,
        data: appointments,
        meta: metadata,
    })
})

// @desc      Find user appointment
// @route     GET /api/v1/user/{user_id}/appointment/{id}
// @access    Private
exports.findUserAppointment = asyncHandler(async (req, res) => {
    let appointmentID = req.params.id
    let userID = req.params.user_id

    const appointment = await AppointmentService.findUserAppointment(
        userID,
        appointmentID
    )

    res.status(200).json({
        success: true,
        data: appointment,
    })
})

// @desc      Create new appointment
// @route     POST /api/v1/user/{id}/appointments
// @access    Private
exports.storeAppointment = asyncHandler(async (req, res) => {
    // Validate inputs
    const errors = validationResult(req)

    // Display errors if validation failed.
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            error: errors.array(),
        })
    }

    const inputs = req.body

    // Add user to inputs
    inputs.user = req.params.user_id

    const appointment = await AppointmentService.createNewAppointment(inputs)

    res.status(200).json({
        success: true,
        data: appointment,
    })
})

// @desc      Count all available slots by
// @route     GET /api/v1/appointments/slots/all
// @access    Private
exports.countAvailableSlotsGroupByDate = asyncHandler(async (req, res) => {
    // Retrieve available slots based on start date and end date
    const availableSlots =
        await AppointmentService.countAvailableSlotsGroupByDate()

    res.status(200).json({
        success: true,
        data: availableSlots,
    })
})

// @desc      Get available appoointment slots
// @route     GET /api/v1/appointments/slots
// @access    Private
exports.getAvailableSlotsByDate = asyncHandler(async (req, res) => {
    // Validate inputs
    const errors = validationResult(req)

    // Display errors if validation failed.
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            error: errors.array(),
        })
    }

    const inputs = req.query

    // Retrieve available slots based on start date and end date
    const availableSlots =
        await AppointmentService.getAvailableSlotsForSpecificDate(inputs.date)

    res.status(200).json({
        success: true,
        data: availableSlots,
    })
})

// @desc      Reschedule appointment
// @route     PATCH /api/v1/user/{id}/appointments/{id}
// @access    Private
exports.rescheduleAppointment = asyncHandler(async (req, res) => {
    let appointmentID = req.params.id
    let userID = req.params.user_id

    const inputs = req.body

    let cancelledAppointment = await AppointmentService.rescheduleAppointment(
        appointmentID,
        userID,
        inputs
    )

    res.status(200).json({
        success: true,
        data: cancelledAppointment,
    })
})

// @desc      Cancel appointment
// @route     DELETE /api/v1/user/{id}/appointments/{id}
// @access    Private
exports.cancelAppointment = asyncHandler(async (req, res) => {
    let appointmentID = req.params.id
    let userID = req.params.user_id

    let cancelledAppointment = await AppointmentService.cancelAppointment(
        appointmentID,
        userID
    )

    res.status(200).json({
        success: true,
        data: cancelledAppointment,
    })
})
