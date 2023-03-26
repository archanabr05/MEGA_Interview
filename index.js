/**
 * Required External Modules
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || '8000';
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '25mb',
  })
);
app.use(
  bodyParser.json({
    limit: '25mb',
  })
);

/**
 *  App Configuration
 */

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/encryptionKey', (req, res) => {
  res.json({ data: '12345' });
});

app.post('/myServer', (req, res) => {
  const requestData = JSON.stringify(req.body);
  fs.writeFile('./uploads/save.txt', requestData, err => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      console.log(`Request data saved!`);
      res.sendStatus(200);
    }
  });
});

/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
