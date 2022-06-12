const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const appointmentConfig = require('../../../config/appointment.config')

const AppointmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Email must be a valid email address',
            ],
        },
        mobile_number: {
            type: String,
            required: [true, 'Mobile number is required'],
            match: [
                /^(01)[0-46-9]*[0-9]{7,8}$/,
                'Mobile number must be a valid format',
            ],
        },
        date: {
            type: String,
            required: [true, 'Date is required'],
        },
        start_time: {
            type: String,
            required: [true, 'Start time is required'],
        },
        end_time: {
            type: String,
            required: [true, 'End time is required'],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: appointmentConfig.STATUSES,
            default: appointmentConfig.STATUSES[1],
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    }
)

AppointmentSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Appointment', AppointmentSchema)
