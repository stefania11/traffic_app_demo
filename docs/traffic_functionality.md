# Traffic Functionality Documentation

## Setup
1. Ensure the `.env` file is configured with the correct API keys:
   - `GOOGLE_MAPS_API_KEY`
   - `OPENAI_API_KEY`
   - `REACT_APP_OPENAI_API_KEY`
   - `REACT_APP_WEBSOCKET_URL`

2. Run the application locally using `npm start`.

## Usage
- Access the application through a web browser at `http://localhost:3000`.
- Use the "Get Traffic" button to retrieve real-time traffic data.

## Testing
- Verify the WebSocket connection is established by checking the browser console for successful connection logs.
- Test the traffic tool by simulating different traffic conditions and observing the application's response.

## Notes
- The application runs without the relay server by adjusting environment variables.
- Ensure all references to the relay server are removed or disabled.
