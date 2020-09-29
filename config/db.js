const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env'});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false 
        });
        console.log('la variable ddb-mongo es' + process.env.DB_MONGO);
        console.log('DB conectada');
    } catch (error) {
        console.log(error);
        process.exit(1); //detener app en caso de error
    }
    
}

module.exports = connectDB;