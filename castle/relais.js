var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var fetchUrl = require('fetch').fetchUrl;
var readline = require('readline');
var app = express();

var restaurants = {};

async function processPseudoJSONLineByLine() { //unfinished, maybe will finish it later if I have time
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

function processHTMLLineByLineWithEvents() {
    const rl = readline.createInterface({
        input: fs.createReadStream('./raw-etablissements.html'),
        clrfDelay: Infinity
    });

    restaurants = {};
    var lastRestaurant = null;

    var reading = 0;
    rl.on('line', (line) => { // using on line event
        if (reading == 0 && line.includes('<h3>France</h3>')) {
            reading = 1;
            console.log('found France');
        }
        else if (reading == 1 && !(line.includes('h3') || line.includes('<') || line.includes(';'))) {
            console.log(`restaurant line: ${line.slice(44)}`);
            if (!line.includes('    Chef - ') && !line.includes('    Maître de maison - ')) {
                lastRestaurant = line.slice(44);
                restaurants[lastRestaurant] = {};
            }
            else if (line.includes('    Chef - ')) {
                restaurants[lastRestaurant].chef = line.slice(55);
            }
            else if (line.includes('    Maître de maison - ')) {
                restaurants[lastRestaurant].maitre = line.slice(67);
            }
        }
        else if (reading == 1 && line.includes('h3')) {
            reading = 2;
            console.log(`h3 line: ${line}`);
            rl.close();
        }
    });

    rl.on('close', () => {
        console.log('close');
        return;
    });
}

async function processHTMLLineByLineWithForLoop() {
    const rl = readline.createInterface({
        input: fs.createReadStream('./raw-etablissements.html'),
        clrfDelay: Infinity
    });

    restaurants = {};
    var lastRestaurant = null;

    var reading = 0;
    for await (const line of rl) {
        if (reading == 0 && line.includes('<h3>France</h3>')) {
            reading = 1;
            console.log('found France');
        }
        else if (reading == 1 && !(line.includes('h3') || line.includes('<') || line.includes(';'))) {
            console.log(`restaurant line: ${line.slice(44)}`);
            if (!line.includes('    Chef - ') && !line.includes('    Maître de maison - ')) {
                lastRestaurant = line.slice(44);
                restaurants[lastRestaurant] = {};
            }
            /*
            else if (line.includes('    Chef - ')) {
                restaurants[lastRestaurant].chef = line.slice(55);
                console.log(restaurants[lastRestaurant]);
                console.log(restaurants);
            }
            else if (line.includes('    Maître de maison - ')) {
                restaurants[lastRestaurant].maitre = line.slice(67);
                console.log(restaurants[lastRestaurant]);
            }
            */
        }
        else if (reading == 1 && line.includes('h3')) {
            reading = 2;
            console.log(`h3 line: ${line}`);
            console.log(restaurants);
            var toWrite = JSON.stringify(restaurants);
            fs.writeFile("./relais-etablissements.json", toWrite, 'utf8', function (err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    return console.log(err);
                }
                console.log("JSON file has been saved.");
            });
            break;
        }
    }
}



app.get('/naive', function(req, res) {

    // All the web scraping magic will happen here // or not, that was a bad idea, the website is not pretty and well done, has a ton of things going all around

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

module.exports.scrap = function etablissements() {
    fetchUrl("https://www.relaischateaux.com/fr/site-map/etablissements", {"credentials":"include","headers":{"accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8","accept-language":"en-GB,en-US;q=0.9,en;q=0.8","cache-control":"max-age=0","upgrade-insecure-requests":"1"},"referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"}, function(error, meta, body) {
        fs.writeFile('raw-etablissements.html', body, function(err) {
            console.log('raw-etablissements.html successfully written');
        });
    });
}

module.exports.process = function process() {
    processHTMLLineByLineWithForLoop();
    console.log(`restaurants: ${restaurants}`);
}
