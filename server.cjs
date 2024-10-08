const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Ensure the API key is not exposed in client-side code
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!GOOGLE_MAPS_API_KEY) {
  console.error('GOOGLE_MAPS_API_KEY is not set in the environment variables');
  process.exit(1);
}

app.get('/api/traffic', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).send('Missing latitude or longitude parameters');
    }
    const url = `https://roads.googleapis.com/v1/nearestRoads?points=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(url);
    if (response.data && response.data.snappedPoints) {
      // Only send necessary data to the client
      const sanitizedData = {
        snappedPoints: response.data.snappedPoints.map(point => ({
          location: point.location,
          originalIndex: point.originalIndex,
          placeId: point.placeId
        }))
      };
      res.json(sanitizedData);
    } else {
      res.status(404).send('No road segments found');
    }
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    if (error.response) {
      res.status(error.response.status).send(`Error fetching traffic data: ${error.response.data}`);
    } else {
      res.status(500).send('Error fetching traffic data');
    }
  }
});

app.listen(port, () => {
  console.log(`Traffic data server running on port ${port}`);
});
