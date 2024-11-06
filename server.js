// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');  // Importing CORS package

const app = express();

const PORT = process.env.PORT || 3000;  // Use environment port or fallback to 3000

// Allow requests from GitHub Pages (frontend URL)
const allowedOrigins = ['https://nathan-boquiren.github.io'];  // Replace with your actual GitHub Pages URL

// Enable CORS for your frontend
app.use(cors({
    origin: allowedOrigins,  // Restrict to your frontend URL
    methods: ['GET', 'POST', 'DELETE'],  // Allow specific HTTP methods
    allowedHeaders: ['Content-Type'],  // Allow specific headers
}));

// Set up body-parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Append timestamp to filename
    },
});

const upload = multer({ storage });

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to handle file uploads
app.post('/upload', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    return res.send({ message: 'File uploaded successfully', imageUrl });
});

// Route to fetch images
app.get('/images', (req, res) => {
    const fs = require('fs');
    const uploadDir = path.join(__dirname, 'uploads');

    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.status(500).send('Error reading files');
        const imageUrls = files.map(file => `/uploads/${file}`);
        res.json(imageUrls);
    });
});

// Route to delete images
app.delete('/delete/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting the image.' });
        }
        res.json({ message: 'Image deleted successfully.' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
