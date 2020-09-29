const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController')
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//Crear una tarea
// api/tasks
router.post('/', 
    auth,
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('project', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    taskController.createTask
);

//obtiene tareas por proyecto
router.get('/', 
    auth,
    taskController.getTasks
);

//Actualiza tarea
router.put('/:id', 
    auth,
    taskController.updateTask
);

//Elimina tarea
router.delete('/:id', 
    auth,
    taskController.deleteTask
);

module.exports = router;