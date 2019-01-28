var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res){

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
            })

            var hotelName;

            $('.overmapWrap fullmap-container js-done').filter(function() {
                var data = $(this);
                hotelName = data.text();
                json.hotelName = hotelName;

            })
        }
        fs.writeFile('output.json', json, function(err) {
            console.log('File successfully written');
        })

        res.send('Check your console!')

    })

})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
