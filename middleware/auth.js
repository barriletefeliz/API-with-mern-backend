const jsonWebToken = require('jsonwebtoken');

module.exports = function(req, res, next) {
    //lee token del header
    const token = req.header('x-auth-token');
    //console.log(token)

    //chequear si no hay token
    if(!token) {
        return res.status(401).json({ msg: "No hay token, permiso no válido"}) 
    }

    //validar el token
    try {
        const cifrado = jsonWebToken.verify(token, process.env.SECRET);
        req.user = cifrado.user,
        //PUNTO O PUNTO Y COMA?
        next();
    } catch (error) {
        res.status(401).json({msg: 'Token no válido'});   
    }
}