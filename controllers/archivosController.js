const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlace = require('../models/Enlace');


exports.subirArchivo = async (req, res, next) => {

    const configuracionMulter = {
        limits: {fileSize : req.usuario ? (1024 * 1024 * 15) : (1024 * 1024)}, //Archivos de max 1MB
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads')   //Si se subió sin errores se almacena en el directorio actual (dirname), dentro de uloads
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length ); 
                cb(null, `${shortid.generate()}${extension}`); //Errores = null, Se genera nombre unico y se une une con la extensión 
            }
    
           /*fileFilter: (req, file, cb) => {
                if(file.mimetype === "application/pdf") {
                    return cb(null, true); //Quiere decir que no se aceptan archivos del tipo PDF
                }
            }*/
        })
    }
    
    const upload = multer(configuracionMulter).single('archivo'); //Single define que es un archivo en especifico

    upload(req, res, async (error) => {
        console.log(req.file);

        if(!error) { //No hay errores
            res.json({archivo: req.file.filename});
        } else {
            console.log(error);
            return next();
        }
    });

    
}

exports.eliminarArchivo = async (req, res) => {
    console.log('Desde eliminar archivo')
    
    try {
        
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`); //Borra el archivo en el directorio especificado

    } catch (error) {
        console.log(error);
    }
}

//Descarga un archivo
exports.descargar = async (req, res, next) => {

    //Obtiene el enlace
    const {archivo} = req.params;
    const enlace = await Enlace.findOne({url: archivo})

    const archivoDescarga = __dirname + '/../uploads/' + enlace.nombre; //dirname para especificar el directorio princiopal
    
    res.download(archivoDescarga);

    //Eliminar el archivo y la entrada de la BD
    const {descargas, nombre} = enlace;

    //Si las descargas son iguales a 1 - Borrar la entrada y borrar el archivo
    if(descargas === 1) {
        
        //Eliminar el archivo
        req.archivo = nombre;

        //Eliminar la entrada de la BD
        await Enlace.findOneAndRemove(enlace.id);

        next(); //Next hace que se vaya al siguiente controlador

    } else {
        //Si las descargas son mayores a 1 - Restar 1
        enlace.descargas--;
        await enlace.save();
    }

}