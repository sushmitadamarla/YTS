function summarize() {
    const videoId = document.getElementById("videoId").value.trim();
    const summaryElement = document.getElementById("summary");

    // Validate input
    if (!videoId) {
        summaryElement.textContent = "Please enter a valid YouTube video ID.";
        return;
    }

    // Make a request to summarize the video transcript (backend logic)
    fetch('/summarize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ videoId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch summary');
        }
        return response.json();
    })
    .then(data => {
        if (data.summary) {
            console.log('Summary:', data.summary);
            // Update UI with the summary
            summaryElement.textContent = data.summary;
        } else {
            throw new Error('Summary data not found');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        summaryElement.textContent = "Failed to fetch summary. Please try again later.";
    });
}
