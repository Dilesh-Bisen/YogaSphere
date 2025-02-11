const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');

async function createUser(req, res) {
    const { userCollection } = getCollections();
    const newUser = req.body;

    if (!newUser || !newUser.email) {
        return res.status(400).send({ error: "Invalid user data" });
    }

    try {
        const result = await userCollection.insertOne(newUser);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function getUser(req, res) {
    const { userCollection } = getCollections();

    try {
        const result = await userCollection.find({}).toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function getUserById(req, res) {
    const { userCollection } = getCollections();

    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await userCollection.findOne(query);
        if (!result) {
            return res.status(404).send({ error: "User not found" });
        }
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function getUserByEmail(req, res) {
    const { userCollection } = getCollections();

    try {
        const email = req.params.email;
        const query = { email: email };
        const result = await userCollection.findOne(query);
        if (!result) {
            return res.status(404).send({ error: "User not found" });
        }
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function updateUser(req, res) {
    const { userCollection } = getCollections();

    try {
        const id = req.params.id;
        const updatedUser = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
            $set: {
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                address: updatedUser.address,
                about: updatedUser.about,
                photoUrl: updatedUser.photoUrl,
                skills: updatedUser.skills || null,
            }
        };
        const options = { upsert: true };
        const result = await userCollection.updateOne(filter, updateDoc, options);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function deleteUser(req, res) {
    const { userCollection } = getCollections();

    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await userCollection.deleteOne(query);
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser
};
