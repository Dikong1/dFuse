const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the selection page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to serve the user page
app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

// Route to serve the creator page
app.get('/creator', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'creator.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
