const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db;

async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db("yoga-guru");
        await db.command({ ping: 1 });
        console.log("You successfully connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

function getCollections() {
    return {
        userCollection: db.collection("user"),
        classCollection: db.collection("class"),
        cartCollection: db.collection("cart"),
        paymentCollection: db.collection("payment"),
        enrolledCollection: db.collection("enrolled"),
        appliedCollection: db.collection("applied")
    };
}

module.exports = { connectToDatabase, getCollections };
