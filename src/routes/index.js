const express = require('express');
const router = express.Router();
const controller = require("../controllers/serial.controllers");

router.post('/v1', controller.check);

module.exports = router;