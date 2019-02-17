let express = require('express');
let app = express();
let relais = require('./relais.js');

let scrap = relais.scrap;
let process = relais.process;

app.get('/scrap', function(req, res) {
    scrap();
});

app.get('/process', function(req, res) {
    process();
});

app.get('/', (req, res) =>
        res.send('hello world'));

app.listen('8081');

console.log('Magic happens on port 8081');

