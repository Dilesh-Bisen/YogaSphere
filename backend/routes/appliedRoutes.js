const express = require('express');
const router = express.Router();
const appliedController = require('../controllers/appliedController');

router.post('/apply-instructor', appliedController.applyForInstructor);
router.get('/applied-instructors/:email', appliedController.getAppliedInstructors);

module.exports = router;
