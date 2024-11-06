const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Moved this import to the top for consistency

const app = express();
const PORT = 3000;

// Set up body-parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append the current timestamp to the file name
    },
});

const upload = multer({ storage });

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static('public')); // Ensure this is after your uploads static path to avoid conflicts

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
    const uploadDir = path.join(__dirname, 'uploads');

    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.status(500).send('Error reading files');
        const imageUrls = files.map(file => `/uploads/${file}`);
        res.json(imageUrls);
    });
});

// Route to delete an image
app.delete('/delete/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename); // Adjust the path as necessary

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
