const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');

async function applyForInstructor(req, res) {
    const { appliedCollection } = getCollections();
    const applicationData = req.body;

    if (!applicationData || !applicationData.userEmail) {
        return res.status(400).send({ error: "Invalid application data" });
    }

    try {
        const result = await appliedCollection.insertOne(applicationData);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function getAppliedInstructors(req, res) {
    const { appliedCollection } = getCollections();
    const email = req.params.email;

    if (!email) {
        return res.status(400).send({ error: "Email parameter is required" });
    }

    try {
        const query = { userEmail: email };
        const result = await appliedCollection.find(query).toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = {
    applyForInstructor,
    getAppliedInstructors
};
