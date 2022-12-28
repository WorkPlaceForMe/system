const express = require('express');
const router = express.Router();
const controller = require("../controllers/serial.controllers");
const controllerLogin = require("../controllers/auth.controllers");
const middleware = require('../middleware/auth.middleware')

router.post('/serial',[middleware.verifyToken], controller.check);

router.post('/gen',[middleware.verifyToken] , controller.create);

router.get('/retrieve',[middleware.verifyToken] , controller.retrieve);

router.post('/retrieveOne',[middleware.verifyToken] , controller.retrieveOne);

router.put('/update',[middleware.verifyToken] , controller.update);

router.delete('/del/:id',[middleware.verifyToken] , controller.del);

router.get('/check',[middleware.verifyToken] , controllerLogin.check);

router.post('/login', controllerLogin.login);

router.get('/info', controllerLogin.info)

module.exports = router;