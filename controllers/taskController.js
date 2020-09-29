const Task = require('../models/Task');
const Project = require('../models/Project');
const {validationResult } = require('express-validator');

//Creación de una nueva tarea
exports.createTask = async (req, res) => {

    //chequear si hay errores
    const errors = validationResult(req);
    
    if( !errors.isEmpty() ) {
        return res.status(400).json({errors: errors.array() })
    }
    
    // Comprueba si existe
    try {
    
        // Extrae el proyecto 
        const { project } = req.body;

        const projectFound = await Project.findById(project);
        if(!projectFound){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //revisa si el proyecto pertenece al usuario autenticado
        if(projectFound.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado'});
        }

        //Crea la tarea
        const task = new Task(req.body);
        await task.save();
        res.json({ task });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

//Obtención de tareas por proyecto
exports.getTasks = async (req, res) => {
    try {
        // Extrae el proyecto 
        const { project } = req.query;
        //const { project } = req.body;

        const projectFound = await Project.findById(project);
        if(!projectFound){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //revisa si el proyecto pertenece al usuario autenticado
        if(projectFound.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado'});
        }

        // Obtiene las tareas por proyecto
        const tasks = await Task.find({ project }).sort({creationdate: -1});
        res.json({ tasks });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error'}); 
    } 
}

//Actualiza una tarea
exports.updateTask = async (req, res) => {
    
    try {
        // Extrae el proyecto 
        const { project, name, state } = req.body;

        //Chequea existencia de la tarea y por lo tanto del proyecto
        let task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({ msg: 'Tarea no existente'});
        }

        //Extacción proyecto
        const projectFound = await Project.findById(project);

        //revisa si el proyecto pertenece al usuario autenticado
        if(projectFound.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado'});
        }

        //Crea objeto con la nueva info
        const newTask = {};
        newTask.name = name;
        newTask.state = state;
        
        //Guarda tarea
        task = await Task.findOneAndUpdate({ _id: req.params.id}, newTask, {new: true });
        res.json({ task});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});       
    }
}

//Elimina la tarea
 exports.deleteTask = async (req, res) => {
    try {
        // Extrae el proyecto 
        const { project, creator } = req.query;

        //Chequea existencia de la tarea y por lo tanto del proyecto
        let task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({ msg: 'Tarea no existente'});
        }

        //Extracción proyecto
        const projectFound = await Project.findById(project);

        //revisa si el proyecto pertenece al usuario autenticado
        if(projectFound.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado'});
        }

        //Eliminar
        await Task.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Tarea Eliminada' })

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error'});       
    }
}