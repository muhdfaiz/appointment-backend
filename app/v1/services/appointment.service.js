var Appointment = require('../models/appointment.model')
const ErrorResponse = require('../../../utils/errorResponse')
const {
    generateAppointmentTimeRangeDaily,
    generateAvailableAppointmentDates,
} = require('../../../utils/date')
const moment = require('moment')
const appointmentConfig = require('../../../config/appointment.config')

/**
 * Find user appointment
 *
 * @param {Number} userID
 * @param {Number} appointmentID
 * @returns {Appointment}
 */
exports.findUserAppointment = async (userID, appointmentID) => {
    let appointment = Appointment.findOne({
        _id: appointmentID,
        user: userID,
    })

    if (!appointment) {
        throw new ErrorResponse(`Appointment not found`, 404)
    }

    return appointment
}

/**
 * Get list of user appointments.
 *
 * @param {Number} userID
 * @param {Number} page
 * @param {Number} limit
 * @param {String} search
 * @returns {Object}
 */
exports.getUserAppointments = async (userID, page, limit, search) => {
    let query = {
        user: userID,
    }

    if (search) {
        query.$or = [
            { name: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') },
            { mobile_number: new RegExp(search, 'i') },
        ]
    }

    return Appointment.paginate(query, {
        page: page,
        limit: limit,
        sort: {
            date: -1,
        },
    })
        .then((result) => {
            const appointments = result.docs
            delete result.docs

            let paginationData = result
            return { metadata: paginationData, appointments: appointments }
        })
        .catch(() => {
            throw new ErrorResponse(`The Server Encountered an Error`, 500)
        })
}

/**
 * Store new appointment.
 *
 * @param {Array} inputs
 * @returns {Appointment}
 */
exports.createNewAppointment = async (inputs) => {
    // Check if the appointment for the date and time already exist
    const appointmentExist = await Appointment.findOne({
        date: inputs.date,
        start_time: inputs.start_time,
        end_time: inputs.end_time,
        status: { $ne: appointmentConfig.STATUSES[0] },
    })

    // If appointment already exist, throw an error
    if (appointmentExist) {
        throw new ErrorResponse(
            `Appointment on ${inputs.date} at ${inputs.start_time} not available.`,
            409
        )
    }

    // Set appointment status to confirmed.
    inputs.status = appointmentConfig.STATUSES[1]

    // Store new appointment
    return await Appointment.create(inputs)
}

/**
 * Get number of time slots available for for specific date.
 *
 * @param {String} date
 * @returns {Array}
 */
exports.getAvailableSlotsForSpecificDate = async (date) => {
    // Retrieve existing appointments for the date
    let existingAppointments = await Appointment.find({
        date: date,
        status: { $ne: appointmentConfig.STATUSES[0] },
    }).select('_id, start_time')

    // Only get start date time.
    existingAppointments = existingAppointments.map(
        (appointment) => appointment.start_time
    )

    // Generate all time slots between the date
    let slotsAvailable = generateAppointmentTimeRangeDaily()

    // Available slots
    return slotsAvailable.filter((slot) => !existingAppointments.includes(slot))
}

/**
 * Get total number of time slots available for each available dates.
 */
exports.countAvailableSlotsGroupByDate = async () => {
    let twoDaysDateFromToday = moment()
        .add(appointmentConfig.EARLIEST_DAYS_CAN_BOOK, 'days')
        .format('YYYY-MM-DD')

    let maximumDateUserCanBook = moment()
        .add(appointmentConfig.MAXIMUM_DAYS_CAN_BOOK, 'days')
        .format('YYYY-MM-DD')

    // Retrieve available slots for each date.
    let numberOfAvailableSlots = await Appointment.aggregate([
        {
            $match: {
                date: {
                    $gte: twoDaysDateFromToday,
                    $lte: maximumDateUserCanBook,
                },
                status: { $ne: appointmentConfig.STATUSES[0] },
            },
        },
        {
            $group: {
                _id: '$date',
                booked_slots: { $sum: 1 },
            },
        },
        {
            $addFields: {
                number_of_available_slots: {
                    $subtract: [9, '$booked_slots'],
                },
            },
        },
    ])

    let dates = generateAvailableAppointmentDates(
        twoDaysDateFromToday,
        maximumDateUserCanBook
    )

    let bookedSlots = Object.fromEntries(
        numberOfAvailableSlots.map(({ _id, booked_slots }) => [
            _id,
            booked_slots,
        ])
    )

    let result = []

    dates.map((date) => {
        let numberOfSlotsAvailable = 9

        if (bookedSlots[date] !== undefined) {
            numberOfSlotsAvailable = numberOfSlotsAvailable - bookedSlots[date]
        }

        result.push({
            date: date,
            title: `${numberOfSlotsAvailable} slots`,
        })
    })

    return result
}

/**
 * Reschedule an appointment
 *
 * @param {Number} appointmentID
 * @param {Number} userID
 * @param {Array} inputs
 * @returns {Appointment}
 */
exports.rescheduleAppointment = async (appointmentID, userID, inputs) => {
    // Check if the appointment for the date and time already exist
    const appointmentExist = await Appointment.findOne({
        date: inputs.date,
        start_time: inputs.start_time,
        end_time: inputs.end_time,
        status: { $ne: appointmentConfig.STATUSES[0] },
    })

    // If appointment already exist, throw an error
    if (appointmentExist) {
        throw new ErrorResponse(
            `Appointment on ${inputs.date} at ${inputs.start_time} not available.`,
            409
        )
    }

    let appointment = await Appointment.findOne({
        _id: appointmentID,
        user: userID,
    })

    // Check if appointment user want to reschedule belong to the user.
    if (!appointment) {
        throw new ErrorResponse(`Appointment not found`, 404)
    }

    // Check if appointment status 'cancelled'. Cannot reschedule 'cancelled' appointment
    if (appointment.status === appointmentConfig.STATUSES[0]) {
        throw new ErrorResponse(
            `Cannot reschedule ${appointmentConfig.STATUSES[0]} appointment`,
            401
        )
    }

    // Update appointment date and time.
    return await Appointment.findByIdAndUpdate(appointmentID, inputs, {
        new: true,
    })
}

/**
 * Cancel an appointment.
 *
 * @param {Number} appointmentID
 * @param {Number} userID
 * @returns {Appointment}
 */
exports.cancelAppointment = async (appointmentID, userID) => {
    let appointment = await Appointment.findOne({
        _id: appointmentID,
        user: userID,
    })

    // Check if appointment user want to delete belong to the user.
    if (!appointment) {
        throw new ErrorResponse(`Appointment not found`, 404)
    }

    // Update appointment status to cancelled.
    return await Appointment.findByIdAndUpdate(
        appointmentID,
        {
            status: appointmentConfig.STATUSES[0],
        },
        {
            new: true,
        }
    )
}
