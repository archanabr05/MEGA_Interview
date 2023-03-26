/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");
const fs = require('fs');
const bodyParser = require('body-parser');
const CryptoJS = require("crypto-js");

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '25mb'
}));
app.use(bodyParser.json({
    limit: '25mb'
}));

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.post("/myServer", (req, res) => {
    const { data, key } = JSON.parse(res.body); 
    const encrypted = CryptoJS.AES.encrypt(data, key);
    // save encrypted file to a folder;
    res.end('File Upload Successfull');
});

/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});