const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');

async function popularClasses(req, res) {
    const { classCollection } = getCollections();

    try {
        const result = await classCollection.find().sort({ totalEnrolled: -1 }).limit(6).toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function popularInstructor(req, res) {
    const { classCollection } = getCollections();

    try {
        const pipeline = [
            {
                $group: {
                    _id: "$instructorEmail",
                    totalEnrolled: { $sum: "$totalEnrolled" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "email",
                    as: "instructor"
                }
            },
            {
                $project: {
                    _id: 0,
                    instructor: {
                        $arrayElemAt: ["$instructor", 0]
                    },
                    totalEnrolled: 1
                }
            },
            {
                $sort: {
                    totalEnrolled: -1
                }
            },
            {
                $limit: 6
            }
        ];

        const result = await classCollection.aggregate(pipeline).toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function adminStatus(req, res) {
    const { classCollection, userCollection, enrolledCollection } = getCollections();

    try {
        const approvedClasses = await classCollection.countDocuments({ status: 'approved' });
        const pendingClasses = await classCollection.countDocuments({ status: 'pending' });
        const instructorCount = await userCollection.countDocuments({ role: 'instructor' });
        const totalClasses = await classCollection.countDocuments();
        const totalEnrolled = await enrolledCollection.countDocuments();

        const result = {
            approvedClasses,
            pendingClasses,
            instructorCount,
            totalClasses,
            totalEnrolled
        };
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function getInstructor(req, res) {
    const { userCollection } = getCollections();

    try {
        const result = await userCollection.find({ role: 'instructor' }).toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

async function enrolledClasses(req, res) {
    const { enrolledCollection } = getCollections();

    try {
        const email = req.params.email;
        const query = { userEmail: email };

        const pipeline = [
            {
                $match: query
            },
            {
                $lookup: {
                    from: "classes",
                    localField: "classesId",
                    foreignField: "_id",
                    as: "classes"
                }
            },
            {
                $unwind: "$classes"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "classes.instructorEmail",
                    foreignField: "email",
                    as: "instructor"
                }
            },
            {
                $project: {
                    _id: 0,
                    instructor: {
                        $arrayElemAt: ["$instructor", 0]
                    },
                    classes: 1
                }
            }
        ];

        const result = await enrolledCollection.aggregate(pipeline).toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = {
    popularClasses,
    popularInstructor,
    adminStatus,
    getInstructor,
    enrolledClasses
};