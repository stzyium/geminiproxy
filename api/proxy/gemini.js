module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed', message: 'This endpoint only accepts POST requests' });
    }

    const apiKey = req.headers['x-api-key'];
    const model = req.headers['x-model'];
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is missing' });
    }

    const requestData = req.body;


    let fetch;
    try {
      const fetchModule = await import('node-fetch');
      fetch = fetchModule.default;
    } catch (error) {
      throw new Error('Failed to load node-fetch module');
    }

    const externalApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const externalApiResponse = await fetch(externalApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    const responseData = await externalApiResponse.json();

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
