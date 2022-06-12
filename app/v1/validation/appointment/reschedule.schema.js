const RescheduleAppointmentSchema = {
    date: {
        notEmpty: {
            errorMessage: 'Date is required.',
        },
        isDate: {
            options: {
                format: 'YYYY-MM-DD',
            },
            errorMessage: 'Date format must be YYYY-MM-DD.',
        },
    },
    start_time: {
        notEmpty: {
            errorMessage: 'Start time is required.',
        },
        matches: {
            options: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            errorMessage: 'Start time format must be HH:mm',
        },
    },
    end_time: {
        notEmpty: {
            errorMessage: 'End time is required.',
        },
        matches: {
            options: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            errorMessage: 'End time format must be HH:mm',
        },
    },
}

module.exports = RescheduleAppointmentSchema
