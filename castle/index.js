var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var fetchUrl = require('fetch').fetchUrl;
var readline = require('readline');
var app = express();

async function processLineByLine() {
    const fileStream = fs.createReadStream('raw-output.html');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    const appendStream = fs.open(); // TODO

    var reading = 0;
    for await (const line of rl) {
        // Each line in input.txt will be successively available here as `line`.
        console.log(`Line from file: ${line}`);

        if (reading == 0 && line.contains('oMapOptionsdestinationfranceMap')) {
            reading = 1;

        }
        else if (reading == 1 && line.contains('markers')) {
            reading = 2;
        }
        else if (reading == 2 && !line.contains('</script>')) {
            // TODO
        }
        else {
            reading = 3;
        }
    }
}

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
        fs.writeFile('raw-output.html', body, function(err) {
            console.log('raw-output.html successfully written');
        });
    });
});

app.get('/', (req, res) =>
        res.send('hello world'));

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;
