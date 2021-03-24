const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
require('dotenv').config({path: 'variables.env'}); //El path es absoluto por ello no require salirse del directorio

exports.autenticarUsuario = async (req, res, next) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(401).json({errores: errores.array()});
    }

    //Buscar el usuario para ver si este está registrado
    const {email, password} = req.body;
    const usuario = await Usuario.findOne({email});

    if(!usuario) {
        res.status(401).json({msg: 'EL usuario no existe'}); //Error 401, las credenciales no son correctas
        return next(); //Para que no se ejecute el código siguiente
    }

    //Verificar el password y autenticar el usuario
    if(bcrypt.compareSync(password, usuario.password)) { //2 parametros, el password introducido en el POST y el password obtenido del usuario una vez consultada la DB, Sync porque se está utilizanso Async-Await
    
        //Crear JSON web token
        const token = jwt.sign({
            id: usuario._id,
            nombre: usuario.nombre
        }, process.env.SECRETA, {
            expiresIn: '8h'
        });//Firmar el JWT, con parametros del usuario y una palabra secreta, objeto de configuración, en este caso tiempo de expiración

        res.json({token});

    } else {
        res.status(401).json({msg: 'Password incorrecto'});
        return next();
    }

}

exports.usuarioAutenticado = (req, res, next) => {

    res.json({usuario: req.usuario});

}
