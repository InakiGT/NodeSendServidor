const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const {check} = require('express-validator');

router.post('/',
    [//Verificación de los datos enviados por POST desde el Routing
        check('nombre', 'El nombre es obligatorio').not().isEmpty(), //revisa 'nombre', se le asigna un mensaje de error y se realizan las verificaciones especiificadas
        check('email', 'Agrega un Email valido').isEmail(),
        check('password', 'El password debe ser de al menos 6 caracteres').isLength({min: 6})
    ],
    usuarioController.nuevoUsuario
);

module.exports = router;