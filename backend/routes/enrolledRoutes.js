const express = require('express');
const router = express.Router();
const enrolledController = require('../controllers/enrolledController');

router.get('/popular-classes', enrolledController.popularClasses);
router.get('/popular-instructors', enrolledController.popularInstructor);
router.get('/admin-status', enrolledController.adminStatus);
router.get('/instructors', enrolledController.getInstructor);
router.get('/enrolled-classes/:email', enrolledController.enrolledClasses);

module.exports = router;