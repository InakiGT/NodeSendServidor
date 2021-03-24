const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');

exports.nuevoUsuario = async (req, res) => {
    
    //Mostrar mensajes de error de express-validator
    const errores = validationResult(req); //En el req encuentra si hay errores, provenientes del check del routing
    if(!errores.isEmpty()) { //Si no está vacio
        return res.status(400).json({errores: errores.array()}); //Muestra en la respuesta al POST el error. .array para convertir los valores de errores en un arreglo
    }

    //Verificar si el usuario ya está registrado
    const {email, password} = req.body;

    let usuario = await Usuario.findOne({email});

    if(usuario) {
        return res.status(400).json({msg: 'El usuario ya está registrado'});
    }

    
    //Crear un nuevo usuario
    usuario = new Usuario(req.body);

    //Hashear el password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    try {

        await usuario.save();
        res.json({msg: 'Usuario creado correctamente'});

    } catch (error) {
        console.log(error)
    }
}