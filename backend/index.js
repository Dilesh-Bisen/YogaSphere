const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./config/db');
const classRoutes = require('./routes/classRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); 
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3045;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', classRoutes);
app.use('/api', cartRoutes);
app.use('/api', paymentRoutes);  

app.get('/', (req, res) => {
    res.send('Hello Dilesh!');
});

connectToDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
