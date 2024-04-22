const axios = require('axios');
const { google } = require('googleapis');
const youtube = require('./youtube');

// Function to retrieve the transcript of a YouTube video
async function getVideoTranscript(videoId) {
    const response = await youtube.captions.list({
        videoId,
        part: 'snippet',
    });

    const captionId = response.data.items[0].id;

    const transcriptResponse = await youtube.captions.download({
        id: captionId,
        tfmt: 'ttml',
    });

    return transcriptResponse.data;
}

// Function to summarize the transcript using Google Cloud Natural Language API
async function summarizeTranscript(videoId) {
    try {
        // Get the transcript of the video
        const transcript = await getVideoTranscript(videoId);

        // Initialize the Google Cloud Natural Language API client
        const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

        if (!apiKey) {
            throw new Error('API key not found in environment variables');
        }

        const language = google.language({
            version: 'v1',
            auth: apiKey,
        });

        // Analyze the transcript text and extract the summary
        const analyzeResult = await language.documents.analyzeEntities({
            document: {
                content: transcript,
                type: 'PLAIN_TEXT',
            },
        });

        // Extract and format the summary
        const summary = analyzeResult.data.entities.map(entity => entity.name).join(' ');

        return summary;
    } catch (error) {
        console.error('Error summarizing transcript:', error);
        throw error;
    }
}

// Make a POST request to summarize the transcript
async function summarizeTranscriptWithAxios(videoId) {
    try {
        const response = await axios.post('http://localhost:3000/summarize', { videoId });
        return response.data.summary;
    } catch (error) {
        console.error('Error summarizing transcript:', error);
        throw error;
    }
}

module.exports = { summarizeTranscript: summarizeTranscriptWithAxios };
