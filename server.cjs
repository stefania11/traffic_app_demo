const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

app.get('/api/traffic', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).send('Missing latitude or longitude parameters');
    }
    const url = `https://roads.googleapis.com/v1/nearestRoads?points=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(url);
    if (response.data && response.data.snappedPoints) {
      res.json(response.data);
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
  console.log(`Proxy server running on port ${port}`);
});
