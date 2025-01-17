const express = require('express');
const cors = require('cors'); // For enabling CORS
const path = require('path');
const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());

// Serve static files (for CSS, JS, images, etc.)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/js', express.static(path.join(__dirname, 'js')));  // Serve JS folder as a static directory

// Endpoint to serve the products JSON file
app.get('/products', (req, res) => {
  // Dynamically load the JSON file
  const productsData = require('./js/public/she-page.json'); // Path to your JSON file
  res.json(productsData); // Send the data as JSON response
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
