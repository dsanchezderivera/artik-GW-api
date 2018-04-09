const express = require('express');
const router = express.Router();

/* CONTROLLER */
const DevicesController = require('../controllers/devices.js');

/* API GET */
router.get('/', DevicesController.devices_get_all);

/* API PUT */
/* USAGE /?mac=91:75:1a:ec:9a:c7*/
router.put('/?*', DevicesController.device_update);

module.exports = router;