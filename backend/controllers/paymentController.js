const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');
const stripe = require('../config/stripe');

async function createPaymentIntent(req, res) {
    const { price } = req.body;

    if (!price || isNaN(price)) {
        return res.status(400).send({ error: "Invalid price" });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: parseInt(price) * 100,
            currency: "usd",
            payment_method_types: ['card'],
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function createPaymentInfo(req, res) {
    const { cartCollection, classCollection, enrolledCollection, paymentCollection } = getCollections();

    try {
        const paymentInfo = req.body;
        const classesId = paymentInfo.classesId;
        const userEmail = paymentInfo.userEmail;
        const singleClassId = req.query.classesId;

        if (!Array.isArray(classesId) || !userEmail) {
            return res.status(400).send({ error: "Invalid input data" });
        }

        let query;
        if (singleClassId) {
            query = { classId: singleClassId, email: userEmail };
        } else {
            query = { classId: { $in: classesId } };
        }

        const classesQuery = { _id: { $in: classesId.map(id => new ObjectId(id)) } };

        const newEnrollmentData = {
            userEmail: userEmail,
            classesId: classesId.map(id => new ObjectId(id)),
            transactionId: paymentInfo.transactionId
        };

        const updateDoc = {
            $inc: {
                totalEnrolled: 1,
                availableSeats: -1,
            }
        };

        const updatedResult = await classCollection.updateMany(classesQuery, updateDoc);
        const enrolledResult = await enrolledCollection.insertOne(newEnrollmentData);
        const deleteResult = await cartCollection.deleteMany(query);
        const paymentResult = await paymentCollection.insertOne(paymentInfo);

        res.send({ paymentResult, deleteResult, enrolledResult, updatedResult });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function getPaymentHistory(req, res) {
    const { paymentCollection } = getCollections();
    try {
        const email = req.params.email;
        const query = { userEmail: email };
        const result = await paymentCollection.find(query).sort({ date: -1 }).toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function getPaymentHistoryLength(req, res) {
    const { paymentCollection } = getCollections();
    try {
        const email = req.params.email;
        const query = { userEmail: email };
        const total = await paymentCollection.countDocuments(query);
        res.send({ total });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = {
    createPaymentIntent,
    createPaymentInfo,
    getPaymentHistory,
    getPaymentHistoryLength
};