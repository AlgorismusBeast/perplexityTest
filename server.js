const express = require('express');
const path = require('path');
const { perplexityTest } = require('./perplexityTest');
const app = express();
const port = 3000;

perplexityTest()
  .then(({ headers, cookies }) => {
    console.log('Headers and cookies:', headers, cookies);

    // Start the server after perplexityTest finishes
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  })
  .catch((error) => {
    console.error('An unexpected error occurred:', error);
  });

// Route to serve the main page that will display the images
app.get('/', (req, res) => {
  res.send(`
    <h1>Images from perplexityTest:</h1>
    <img src="/image.png" alt="image.png" width="400"/><br/>
    <img src="/image2.png" alt="image2.png" width="400"/><br/>
    <img src="/image3.png" alt="image3.png" width="400"/>
  `);
});

// Routes to serve the individual images
app.get('/image.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'image.png'));
});

app.get('/image2.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'image2.png'));
});

app.get('/image3.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'image3.png'));
});
