const express = require('express');
const cors = require('cors');
const uploadRouter = require('./routes/tickets'); // Import the router

const app = express();
const PORT = process.env.PORT || 4000; // Use environment variable for port

app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific methods or all methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers (optional)
    credentials: true // Set to true if you want to allow credentials (like cookies)
}));
app.use(express.json());

// Use the upload router
app.use('/api', uploadRouter); // Mount the router at the /api endpoint

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
