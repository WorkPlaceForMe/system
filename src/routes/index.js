const express = require('express');
const router = express.Router();
const controller = require("../controllers/serial.controllers");

router.post('/serial', controller.check);

module.exports = router;