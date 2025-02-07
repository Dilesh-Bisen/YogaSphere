const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

router.post('/new-class', classController.createClass);
router.get('/classes', classController.getAllClasses);
router.get('/classes-status', classController.getApprovedClasses);
router.get('/classes/:email', classController.getClassesByEmail);
router.get('/approved-classes', classController.getApprovedClasses);
router.get('/class/:id', classController.getClassById);
router.patch('/update-status/:id', classController.updateClassStatus);
router.put('/update-class/:id', classController.updateClassDetails);

module.exports = router;
