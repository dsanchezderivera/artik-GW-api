const express = require('express');
const router = express.Router();

/* CONTROLLER */
const DevicesController = require('../controllers/devices.js');

/* API GET */
router.get('/', DevicesController.devices_get_all);

/* API PUT */
/* USAGE /?mac=3DF2C9A6B34F*/
router.put('/?*', DevicesController.device_update);

module.exports = router;