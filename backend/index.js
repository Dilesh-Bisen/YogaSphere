const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3045;

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const database = client.db("yoga-guru");
        const userCollection = database.collection("user");
        const classCollection = database.collection("class");
        const cartCollection = database.collection("cart");
        const paymentCollection = database.collection("payment");
        const enrolledCollection = database.collection("enrolled");
        const appliedCollection = database.collection("applied");

        await client.db("admin").command({ ping: 1 });
        console.log("You successfully connected to MongoDB!");
    } finally {
        await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Dilesh!')
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
