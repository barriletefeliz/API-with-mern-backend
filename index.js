const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors'); 

//creación del servidor
const app = express();

//conectar a base de datos
connectDB();

//habilitar cors
app.use(cors());

//habilita express.json
app.use(express.json({ extended: true}));

//puerto del servidor 
const port = process.env.PORT || 4000;

//definición de las rutas
app.use('/api/users', require('./routes/users.js'));
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/projects', require('./routes/projects.js'));
app.use('/api/tasks', require('./routes/tasks.js'));

//definición de pag principal
app.get('/', (req, res) => {
    res.send('funcionando...');
});  

//arrancar servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`el servidor está funcionando desde el puerto ${port}`)
})