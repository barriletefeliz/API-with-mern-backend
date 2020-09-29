//rutas para autenticación de usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth')

//Iniciar sesión

//api/auth
router.post('/', 
    authController.userAuth

);

//obtiene el usuario autenticado
router.get('/',
    auth,
    authController.authenticatedUser

)

module.exports = router;