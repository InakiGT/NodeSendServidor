const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

const ConectarDB = async () => {
    try {
        
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });

        console.log('DB Conectada');

    } catch (error) {
        console.log('Hubo un error', error);
        process.exit(1); //Detiene el servidor ya que hubo un error
    }
}

module.exports = ConectarDB;