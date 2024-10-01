const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { format } = require('date-fns');
const sanitize = require('sanitize-filename');

const app = express();
const PORT = process.env.PORT || 4000; // Use environment variable for port

// Create uploads directory if it doesn't exist
const UPLOAD_DIR = './uploads';
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, callback) => {
        const now = new Date();
        const formattedDate = format(now, 'yyyy-MM-dd HH:mm:ss').replace(/ /g, '_') + ':' + String(now.getMilliseconds()).padStart(3, '0');
        const sanitizedFilename = sanitize(`${formattedDate}${path.extname(file.originalname)}`);
        
        callback(null, sanitizedFilename);
    }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/; // Define allowed file types
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error('Only images are allowed!'));
};

// Initialize upload
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: fileFilter 
}).array('images', 10); // Max 10 files

// API endpoint to handle ticket uploads
app.post('/tickets', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const { name } = req.body;
        const images = req.files.map(file => file.filename);

        console.log("Ticket name is: ", name);
        images.map(img => {
            console.log("Img name: ", img);
        });

        return res.status(200).json({ message: 'Ticket uploaded successfully', name, images });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
