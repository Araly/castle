let express = require('express');
let app = express();

let relais = require('./relais.js');
let relaisScrap = relais.scrap;
let relaisProcess = relais.process;

let michelin = require('./michelin.js');
let michelinScrap = michelin.scrap;
let michelinProcess = michelin.process;

app.get('/relais', function(req, res) {
    relaisScrap();
    relaisProcess();
});

app.get('/michelin', function(req, res) {
    michelinScrap();
    michelinProcess();
});

app.get('/', (req, res) =>
        res.send('go to /relais or /michelin'));

app.listen('8081');

console.log('Magic happens on port 8081');

