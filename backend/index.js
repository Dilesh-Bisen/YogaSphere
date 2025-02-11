const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const classRoutes = require('./routes/classRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const enrolledRoutes = require('./routes/enrolledRoutes');
const appliedRoutes = require('./routes/appliedRoutes');
const { generateToken, authenticateToken } = require('./middleware/authMiddleware');
const { checkAdmin, checkInstructor } = require('./middleware/roleMiddleware');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3045;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/set-tokens', generateToken);
app.use('/api/admin', authenticateToken, checkAdmin, userRoutes); 
app.use('/api/instructor', authenticateToken, checkInstructor, classRoutes); 
app.use('/api', authenticateToken, cartRoutes);
app.use('/api', authenticateToken, paymentRoutes);
app.use('/api', authenticateToken, enrolledRoutes);
app.use('/api', authenticateToken, appliedRoutes);

app.get('/', (req, res) => {
    res.send('Hello Dilesh!');
});

connectToDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
