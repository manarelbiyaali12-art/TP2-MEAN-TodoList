const express = require('express');
const ctrl = require('../controllers/taskController');

const router = express.Router();

router.get('/', ctrl.getTasks);         // GET    /tasks
router.post('/', ctrl.createTask);      // POST   /tasks
router.put('/:id', ctrl.updateTask);    // PUT    /tasks/:id
router.delete('/:id', ctrl.deleteTask); // DELETE /tasks/:id

module.exports = router;
