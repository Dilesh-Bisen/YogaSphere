const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');

async function createClass(req, res) {
    const { classCollection } = getCollections();
    const newClass = req.body;
    const result = await classCollection.insertOne(newClass);
    res.send(result);
}

async function getAllClasses(req, res) {
    const { classCollection } = getCollections();
    const result = await classCollection.find().toArray();
    res.send(result);
}

async function getApprovedClasses(req, res) {
    const { classCollection } = getCollections();
    const query = { status: 'approved' };
    const result = await classCollection.find(query).toArray();
    res.send(result);
}

async function getClassesByEmail(req, res) {
    const { classCollection } = getCollections();
    const email = req.params.email;
    const query = { instructorEmail: email };
    const result = await classCollection.find(query).toArray();
    res.send(result);
}

async function getClassById(req, res) {
    const { classCollection } = getCollections();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await classCollection.findOne(query);
    res.send(result);
}

async function updateClassStatus(req, res) {
    const { classCollection } = getCollections();
    const id = req.params.id;
    const { status, reason } = req.body;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = { $set: { status, reason } };
    const options = { upsert: true };
    const result = await classCollection.updateOne(filter, updateDoc, options);
    res.send(result);
}

async function updateClassDetails(req, res) {
    const { classCollection } = getCollections();
    const id = req.params.id;
    const updateClass = req.body;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
        $set: {
            name: updateClass.name,
            availableSeats: parseInt(updateClass.availableSeats),
            price: updateClass.price,
            videoLink: updateClass.videoLink,
            description: updateClass.description,
            status: updateClass.status,
            totalEnrolled: parseInt(updateClass.totalEnrolled),
            reason: updateClass.reason
        },
    };
    const options = { upsert: true };
    const result = await classCollection.updateOne(filter, updateDoc, options);
    res.send(result);
}

module.exports = {
    createClass,
    getAllClasses,
    getApprovedClasses,
    getClassesByEmail,
    getClassById,
    updateClassStatus,
    updateClassDetails
};
