const jwt = require('jsonwebtoken');
require('dotenv').config();
const { getCollections } = require('../config/db');

const checkAdmin = async (req, res, next) => {
    const { userCollection } = getCollections();
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).send({ error: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(403).send({ error: "Forbidden: Invalid token" });
        }

        console.log("Decoded token:", decoded); 
        const email = decoded.email;

        if (!email) {
            return res.status(400).send({ error: "Email not found in token" });
        }

        const query = { email: email };
        const user = await userCollection.findOne(query);

        if (!user) {
            console.log("User not found for email:", email);
            return res.status(404).send({ error: "User not found" });
        }

        if (user.role === "admin") {
            next();
        } else {
            return res.status(403).send({ error: "Forbidden: Admin access required" });
        }
    });
};

const checkInstructor = async (req, res, next) => {
    const { userCollection } = getCollections();
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).send({ error: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(403).send({ error: "Forbidden: Invalid token" });
        }

        console.log("Decoded token:", decoded); 
        const email = decoded.email;

        if (!email) {
            return res.status(400).send({ error: "Email not found in token" });
        }

        const query = { email: email };
        const user = await userCollection.findOne(query);

        if (!user) {
            console.log("User not found for email:", email);
            return res.status(404).send({ error: "User not found" });
        }

        if (user.role === "instructor") {
            next();
        } else {
            return res.status(403).send({ error: "Forbidden: Instructor access required" });
        }
    });
};

module.exports = {
    checkAdmin,
    checkInstructor
};
