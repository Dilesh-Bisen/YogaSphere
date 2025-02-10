const stripe = require('../config/stripe');

async function createPaymentIntent(req, res) {
    const { price } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: parseInt(price) * 100,
            currency: "usd",
            payment_method_types: [
                'card_present',
            ],
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function createPaymentInfo(req, res) {

    try {
        const paymentInfo = req.body;
        const classesId = paymentInfo.classesId;
        const userEmail = paymentInfo.userEmail;
        const singleClassId = req.query.classesId;

        let query;
        if (singleClassId) {
            query = { classId: singleClassId, userMail: userEmail };
        }
        else {
            query = { classId: { $in: classesId } };
        }
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function retrievePaymentIntent(req, res) {
    const { id } = req.params;

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(id);
        res.send(paymentIntent);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = {
    createPaymentIntent,
    createPaymentInfo,
    retrievePaymentIntent
};
