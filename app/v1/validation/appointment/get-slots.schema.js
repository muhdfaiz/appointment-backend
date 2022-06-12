const GetAvailableSlotsSchema = {
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
}

module.exports = GetAvailableSlotsSchema
