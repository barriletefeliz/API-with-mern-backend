const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jsonWebToken = require('jsonwebtoken');

exports.userAuth = async (req, res) => {

    //chequear si hay errores
    const errors = validationResult(req);

    if( !errors.isEmpty() ) {
        return res.status(400).json(
            {errors: errors.array(),
            });
    }

    //extracción del mail y pass
    const { email, password } = req.body;

    try {
        //revisa que esté registrado
        let user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ msg: "el usuario no existe"});
        }

        //revisa el pass
        const correctPass = await bcryptjs.compare(password, user.password);
        if(!correctPass) {
            return res.status(400).json({ msg: "Password incorrecto"});
        }

        //si todo está ok, entonces crea y firma el JWT
        const payload = {
            user: {
                id: user.id
            },
        };
        
        //firma el JWT
        jsonWebToken.sign(
            payload, 
            process.env.SECRET, 
            { 
                expiresIn: 3600,
        }, 
        (error, token) => {
            if(error) throw error;
            //envía mensaje de confirmación
            res.json({ 
                token,
            });
        });

    } catch (error) {
        console.log(console.error);    
    }
}

//obtiene qué usuario está autenticado
exports.authenticatedUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user });
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Hubo un error'});     
    }
}