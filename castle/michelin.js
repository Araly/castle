var readline = require('readline');
var fetchUrl = require('fetch').fetchUrl;
var fs = require('fs');
var path = require('path');
var fs = require('fs');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var page = "";
module.exports.scrap = async function restaurants() {
    for (i = 2; i < 35; i++) {
        console.log(i);
        await sleep(5000);
        await fetchUrl("https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin".concat(page), {"credentials":"include","headers":{"accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8","accept-language":"en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7","cache-control":"max-age=0","if-modified-since":"Sun, 17 Feb 2019 18:08:16 GMT","if-none-match":"\"1550426896-0\"","upgrade-insecure-requests":"1"},"referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"}, async function(error, meta, body) {
            //await sleep(5000);
            await fs.writeFile(`./michelin/${page}.html`, body, async function(err) {
                //await sleep(5000);
                await console.log(`${i}: ${page}.html successfully written`);
            });
        });
        page = "\page".concat(i);
    }
}

async function processHTMLLineByLineWithForLoop(filePath) {
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        clrfDelay: Infinity
    });

    restaurants = {};
    var lastRestaurant = null;

    var reading = 0;
    for await (const line of rl) {
        if (reading == 0 && line.includes('poi_card-display-title')) {
            reading = 1;
        }
        else if (reading == 1) {
            lastRestaurant = line.slice(10, -14);
            restaurants[lastRestaurant] = {};
            reading = 2;
            console.log(`title: ${lastRestaurant}`);
        }
        else if (reading == 2 && line.includes('poi_card-display-price')) {
            reading = 3;
        }
        else if (reading == 3) {
            restaurants[lastRestaurant].price = line.slice(16, -20);
            reading = 0;
        }
        else if (line.includes('</html>')) {
            console.log(`end: ${line}`);
            console.log(restaurants);
            var toWrite = JSON.stringify(restaurants);
            fs.appendFile("./michelin-etablissements.json", toWrite, 'utf8', function (err) {
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

module.exports.process = async function process() {
    var directoryPath = path.join(__dirname, './michelin/');
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        files.forEach(function (file) {
            console.log(file);
            processHTMLLineByLineWithForLoop(`./michelin/${file}`);
        });
    });
}
