require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: true }));

let urlDatabase = {}; // In-memory storage for URLs
let idCounter = 0; // Counter to generate unique IDs


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// GET route to check if the input URL is valid
app.get('/api/shorturl/:input', (req, res) => {
  const input = req.params.input;

  dns.lookup(input, (err, address, family) => {
      if (err) {
          return res.status(400).json({ error: 'Invalid URL' });
      }
  });
});

// POST route to create a shortened URL
app.post('/api/shorturl', (req, res) => {
  const origURL = req.body.url; // URL sent from the form

  //debug
  if (!origURL) {
      return res.status(400).json({ error: 'URL is required.' });
  }

   // Generate a unique short ID
   idCounter++;
   urlDatabase[idCounter] = origURL; // Store the URL with the generated ID


  // Here you can add logic to shorten the URL and save it to your database
  res.json({  
    original_url: origURL,
    short_url: idCounter
  }); // Example response
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
