const express = require('express');
const cors = require('cors');
const uploadRouter = require('./routes/uploadRouter'); // Import the router

const app = express();
const PORT = process.env.PORT || 4000; // Use environment variable for port

app.use(cors());
app.use(express.json());

// Use the upload router
app.use('/api', uploadRouter); // Mount the router at the /api endpoint

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
