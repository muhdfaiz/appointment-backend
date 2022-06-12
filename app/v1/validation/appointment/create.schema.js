const CreateAppointmentSchema = {
    name: {
        notEmpty: {
            errorMessage: 'Name is required.',
        },
        trim: true,
    },
    email: {
        notEmpty: {
            errorMessage: 'Email is required.',
        },
        isEmail: {
            errorMessage: 'Email must be a valid email address.',
        },
        trim: true,
    },
    mobile_number: {
        notEmpty: {
            errorMessage: 'Mobile number is required.',
        },
        matches: {
            options: /^(01)[0-46-9]*[0-9]{7,8}$/,
            errorMessage: 'Mobile number must be a valid format',
        },
        trim: true,
    },
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

module.exports = CreateAppointmentSchema
