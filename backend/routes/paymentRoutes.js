const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.post('/create-payment-info', paymentController.createPaymentInfo);
router.get('/payment-history/:email', paymentController.getPaymentHistory);
router.get('/payment-history-length/:email', paymentController.getPaymentHistoryLength);

module.exports = router;