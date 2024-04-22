const express = require('express');
const bodyParser = require('body-parser');
const { summarizeTranscript } = require('./javascript/summarizer');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Serve static files from the "my-project" directory
app.use('/javascript', express.static(path.join(__dirname, 'javascript')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Handle GET requests to the root URL
app.get('/', (req, res) => {
    // Serve the index.html file
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle POST requests to the "/summarize" endpoint
app.post('/summarize', async (req, res) => {
    const { videoId } = req.body;

    try {
        // Call the summarizer logic to generate the summary asynchronously
        const summary = await summarizeTranscript(videoId);

        // Send the summary as a response
        res.json({ summary });
    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).json({ error: 'Failed to generate summary' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
