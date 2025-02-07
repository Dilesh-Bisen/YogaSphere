const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3045;

// Middleware
app.use(cors());
app.use(express.json());

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

        app.post('/new-class', async (req, res) => {
            const newClass = req.body;
            const result = await classCollection.insertOne(newClass);
            res.send(result);
        });

        app.get('/classes', async (req, res) => {
            const newClass = req.body;
            const result = await classCollection.insertOne(newClass);
            res.send(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log("You successfully connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Dilesh!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
