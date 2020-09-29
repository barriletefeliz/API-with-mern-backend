const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController')
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//Crea proyectos

//api/projects
router.post('/', 
    auth,
    [
        check('name', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    projectController.createProject
);

//obtener todos los proyectos
router.get('/', 
    auth,
    projectController.getProjects
)

//actualizar proyecto por id


//eliminar proyecto
router.delete('/:id', 
    auth,
    projectController.deleteProject
);


module.exports = router; 