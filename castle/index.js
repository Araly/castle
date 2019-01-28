var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var fetchUrl = require('fetch').fetchUrl;
var app = express();

app.get('/naive', function(req, res) {

    // All the web scraping magic will happen here

    // URL of thing to scrap
    url = 'https://www.relaischateaux.com/us/destinations/europe';

    request(url, function(error, response, html) {
        var json = { hotelName : "" };
        if (!error) {
            var $ = cheerio.load(html);
            console.log($);

            fs.writeFile('raw-output.json', json, function(err) {
                console.log('raw file successfully written');
            });

            var hotelName;

            $('.overmapWrap fullmap-container js-done').filter(function() {
                var data = $(this);
                hotelName = data.text();
                json.hotelName = hotelName;

            });
        };
        fs.writeFile('output.json', json, function(err) {
            console.log('File successfully written');
        });

        res.send('Check your console!');

    });

});

app.get('/fetch', function(req, res) {

    var fetchResult;

    fetchUrl("https://www.relaischateaux.com/us/destinations/europe/france", {"credentials":"include","headers":{"accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8","accept-language":"en-US,en;q=0.9","upgrade-insecure-requests":"1"},"referrer":"https://www.relaischateaux.com/us/destinations/europe","referrerPolicy":"origin-when-cross-origin","body":null,"method":"GET","mode":"cors"}, function(error, meta, body) {
        fs.writeFile('raw-output.json', body, function(err) {
            console.log('raw-output.json successfully written');
        });
    });
});

app.get('/', (req, res) =>
        res.send('hello world'));

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;
