const Project = require('../models/Project');
const {validationResult } = require('express-validator');

exports.createProject = async (req, res) => {
    
    //chequear si hay errores
    const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        return res.status(400).json({errors: errors.array() })
    }
    
    try {
        //Crear nuevo proyecto
        const project = new Project(req.body);
        
        //guarda creador
        project.creator = req.user.id;
        //guarda proyecto
        project.save();
        res.json(project);
    } catch (error) {
        console.log(error);
        res.status(500).send( 'Hubo un error');
    }
}

//obtiene todos los proyectos del usuario actual
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ creator: req.user.id}).sort({creado: -1});
        res.json({ projects }); 
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');      
    }
}

//Actualiza un proyecto
exports.uptadeProject = async (req, res) => {
    //chequear si hay errores
    const errors = validationResult(req);

    if( !errors.isEmpty() ) {
        return res.status(400).json({errors: errors.array() })
    } 

    //extracción de info del proyecto
    const { name } = req.body;
    const newProject = {};

    if(name) {
        newProject.name = name;
    }

    try {

        //chequea id
        let project = await Project.findById(req.params.id);

        //chequea existencia de proyecto
        if(!project) {
            return res.status(404).json({msg: 'Proyecto no encontrado.'})
        }

        //verifica creador del proyecto
        if(project.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado'});
        }

        //actualización
        project = await Project.findByIdAndUpdate({ _id: req.params.id }, 
            { $set: newProject }, 
            { new: true } );

        res.json({project});
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error en el servidor');   
    }
}

// Elimina proyecto por id
exports.deleteProject =  async (req, res) => {
    
    try {
        //chequea id
        let project = await Project.findById(req.params.id);

        //chequea existencia de proyecto
        if(!project) {
            return res.status(404).json({msg: 'Proyecto no encontrado.'})
        }

        //verifica creador del proyecto
        if(project.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado'});
        }

        //Eliminación del proyecto
        await Project.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Proyecto eliminado'})
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error en el servidor')
    }

}