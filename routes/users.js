//rutas para crear usuarios
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 
const { check } = require('express-validator');

//Crea usuario

//Api/users
router.post('/', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Ingresa un correo válido').isEmail(),
        check('password', 'Tu contraseña debe tener al menos 6 caracteres').isLength({min: 6})

    ],
    userController.createUser
);

module.exports = router;