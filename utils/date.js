const moment = require('moment')
const appointmentConfig = require('../config/appointment.config')

/**
 * Generate list of date time between two dates
 *
 * @returns (Array)
 */
const generateAppointmentTimeRangeDaily = () => {
    let dailyTimeRange = []

    for (
        let hour = appointmentConfig.START_HOUR;
        hour < appointmentConfig.END_HOUR;
        hour++
    ) {
        dailyTimeRange.push(hour.toString().padStart(2, '0') + ':00')
    }

    return dailyTimeRange
}

/**
 * Generate available appointment dates based start date and end date
 *
 * @param {String} startDate
 * @param {String} endDate
 * @returns (Array)
 */
const generateAvailableAppointmentDates = (startDate, endDate) => {
    startDate = moment(startDate)
    let dateTimeRange = []

    while (startDate.isSameOrBefore(endDate)) {
        dateTimeRange.push(startDate.format('YYYY-MM-DD'))
        startDate.add(1, 'days')
    }

    return dateTimeRange
}

module.exports = {
    generateAppointmentTimeRangeDaily,
    generateAvailableAppointmentDates,
}
