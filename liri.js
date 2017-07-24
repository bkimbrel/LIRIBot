var keys = require('./keys.js');
var userInputOne = process.argv[2];
var userInputTwo = process.argv[3];
var fs = require('fs');
var logArray = [];


//Node Command Line Aguments For Calling Specific API Requests
if (userInputOne === 'my-tweets') {
    twitterCall();
} else if (userInputOne === 'spotify-this-song') {
    spotifyCall();
} else if (userInputOne === 'movie-this') {
    movieDataCall();
} else if (userInputOne === 'do-what-it-says'){
    fs.readFile('./random.txt', function(err, data) {
        if(err) {
            return console.log(err)
        }
        var file = data.toString().split(",");
        userInputOne = file[0];
        userInputTwo = file[1];
        spotifyCall();
    });

};

//Twitter Get Request And Return Object Function
function twitterCall() {
    var Twitter = require('twitter');
    var client = new Twitter(keys.twitterKeys);
    var params = { screen_name: 'SharkWeek', count: "20" };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var key in tweets) {
                var twitterObj = tweets[key].text
                console.log("===========", twitterObj);
                logArray.push(twitterObj);
                console.log("this is my array++++++++++++++++++++++",logArray);                
            }
            fs.appendFile('log.txt', JSON.stringify(logArray,null, 4), function(err) {
                if(err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            }); 
        }
    });
}


//Spotify API Request and Return Object Function
function spotifyCall() {
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(keys.spotifyKeys);
    spotify.search({ type: 'track', query: `${userInputTwo}`, limit: '1' }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var dataObj = data.tracks.items[0].album;
        var logObj = {
            artists: dataObj.artists[0].name,
            songName: data.tracks.items[0].name,
            spotifyLink: dataObj.external_urls.spotify,
            album: dataObj.name
        }
        console.log(`
            Artist(s)= ${dataObj.artists[0].name}
            Song Name = ${data.tracks.items[0].name}
            Spotify Link = ${dataObj.external_urls.spotify}
            Album = ${dataObj.name}
            `);
            fs.appendFile('log.txt', JSON.stringify(logObj,null, 4), function(err) {
                if(err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            }); 
    });
};


//Movie Database API Request and Return Object Function
function movieDataCall() {
    var request = require('request');
    request(`http://www.omdbapi.com/?t=${userInputTwo}&tomatoes=true&${keys.movieKey}`, function(error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        var bodyObj = JSON.parse(body);
        var logObj = {
            title: bodyObj.Title, 
            year: bodyObj.Year,
            rating: bodyObj.Ratings[0].Value,
            country: bodyObj.Country,
            language: bodyObj.Language,
            plot: bodyObj.Plot,
            actors: bodyObj.Actors,
            rottenTom: bodyObj.Ratings[1].Value
        }
        // var stringifyObj = JSON.stringify(logObj);
            fs.appendFile('log.txt', JSON.stringify(logObj,null, 4), function(err) {
                if(err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });         
        console.log(`
          Title = ${bodyObj.Title}
          Year = ${bodyObj.Year}
          Rating = ${bodyObj.Ratings[0].Value}
          Country = ${bodyObj.Country}
          Language = ${bodyObj.Language}
          Plot = ${bodyObj.Plot}
          Actors = ${bodyObj.Actors} 
          Rotten Tomatoes Rating = ${bodyObj.Ratings[1].Value} 
          `);       
    });
};
