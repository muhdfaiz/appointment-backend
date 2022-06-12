const express = require('express')
const { checkSchema } = require('express-validator')
const {
    getUserAppointments,
    storeAppointment,
    countAvailableSlotsGroupByDate,
    getAvailableSlotsByDate,
    cancelAppointment,
    rescheduleAppointment,
    findUserAppointment,
} = require('../controllers/appointment.controller')
const { auth } = require('../middleware/auth')
const CreateSchema = require('../validation/appointment/create.schema')
const RescheduleSchema = require('../validation/appointment/reschedule.schema')
const GetAvailableSlotsSchema = require('../validation/appointment/get-slots.schema')
const router = express.Router()
const multer = require('multer')
const upload = multer()

router
    .route('/appointments/slots')
    .get(auth, checkSchema(GetAvailableSlotsSchema), getAvailableSlotsByDate)

router
    .route('/users/:user_id/appointments')
    .post(auth, upload.none(), checkSchema(CreateSchema), storeAppointment)
    .get(auth, checkSchema(GetAvailableSlotsSchema), getUserAppointments)

router
    .route('/users/:user_id/appointments/:id')
    .get(auth, findUserAppointment)
    .patch(
        auth,
        upload.none(),
        checkSchema(RescheduleSchema),
        rescheduleAppointment
    )
    .delete(auth, upload.none(), cancelAppointment)

router
    .route('/appointments/slots/all')
    .get(
        auth,
        checkSchema(GetAvailableSlotsSchema),
        countAvailableSlotsGroupByDate
    )

module.exports = router
