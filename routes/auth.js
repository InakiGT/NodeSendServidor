const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {check} = require('express-validator');
const auth = require('../middleware/auth');

router.post('/', //POST hacia la URL especificada en el INDEX
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password no puede ir vacio').not().isEmpty()
    ],
    authController.autenticarUsuario
); 

router.get('/', //GET hacia la URL especificada en el INDEX
    auth, //Este middleware sólo se ejecutara cuando se haga un request a esta ruta
    authController.usuarioAutenticado
);

module.exports = router;