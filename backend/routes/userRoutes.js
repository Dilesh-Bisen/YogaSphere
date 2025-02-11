const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/create-user', userController.createUser);
router.get('/users', userController.getUser);
router.get('/users/:id', userController.getUserById);
router.get('/users/:email', userController.getUserByEmail); 
router.put('/update-user/:id', userController.updateUser);
router.delete('/delete-user/:id', userController.deleteUser);

module.exports = router;
