const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    
    if(authHeader) {
        //Obtener el token
        const token = authHeader.split(' ')[1]; //Va a separar el Bearer del Token y tomará la posición 1, que es el Token
    
        //Comprobar el JWT
        try {
            const usuario = jwt.verify(token, process.env.SECRETA); //Verifica el Token, 2 parametros, el token y la palabra secreta usada para crear el jwt
    
            req.usuario = usuario;     
        } catch (error) {
            console.log('JWT no valido');
        }
    
    }
    return next(); //Una vez que finalice la función, ejecutar otro Middleware
}