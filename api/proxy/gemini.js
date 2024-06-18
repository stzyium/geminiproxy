// api/gemini.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      // If it's a GET request, respond with an error
      return res.status(405).json({ error: 'Method Not Allowed', message: 'This endpoint only accepts POST requests' });
    }

    const apiKey = req.headers['x-api-key'];// Assuming the API key is sent in the 'x-api-key' header
    const model = req.headers['x-model'];
    // Check if API key is provided 
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is missing' });
    }

    const requestData = req.body; // Assuming data is sent in the request body

    // Make request to external API with the provided key
    const externalApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent?key=' + apiKey;
    const externalApiResponse = await fetch(externalApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!externalApiResponse.ok) {
      throw new Error('Failed to fetch data from external API');
    }

    const responseData = await externalApiResponse.json();

    // Send back the response from the external API
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
