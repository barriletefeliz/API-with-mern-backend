const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jsonWebToken = require('jsonwebtoken');

exports.createUser = async (req, res) => {

    //chequear si hay errores
    const errors = validationResult(req);

    if( !errors.isEmpty() ) {
        return res.status(400).json({errors: errors.array() })
    }

    //extraer email y password
    const { email, password } = req.body;
    
    try {
        //valida que el usuario registrado sea único
        let user = await User.findOne({ email });

        if(user) {
            return res.status(400).json({ msg: 'Ya se registró un usuario con ese correo'});
        }
        //crea un nuevo usuario
        user = new User(req.body);

        //hashea el password
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        //guarda nuevo usuario
        await user.save();

        //crea y firma el JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        //firma el JWT
        jsonWebToken.sign(payload, process.env.SECRET, {
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error;

            //envía mensaje de confirmación
            res.json({ token });
        });
        
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}