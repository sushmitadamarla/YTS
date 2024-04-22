const axios = require('axios');

// Define a function to retrieve captions for a specific video
async function getCaptions(videoId, apiKey) {
    try {
        // Make a GET request to the YouTube captions endpoint
        const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/captions?part=snippet%2C%20id&videoId=${videoId}&key=${apiKey}`);

        // Return the response data containing the captions information
        return response.data;
    } catch (error) {
        // Handle errors if any
        console.error('Error fetching captions:', error);
        throw error;
    }
}

module.exports = { getCaptions };
