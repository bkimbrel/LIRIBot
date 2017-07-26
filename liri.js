var keys = require('./keys.js');
var userInputOne = process.argv[2];
var userInputTwo = process.argv[3];
var fs = require('fs');
var logArray = [];
var request = require('request');


//Function to grab tasks 

if (userInputOne === 'my-tweets') {
    twitterTime();
} else if (userInputOne === 'spotify-this-song') {
    spotifyAction();
} else if (userInputOne === 'movie-this') {
    movieInfo();
} else if (userInputOne === 'do-what-it-says'){
    fs.readFile('./random.txt', function(err, data) {
        if(err) {
            return console.log(err)
        }
        var file = data.toString().split(",");
        userInputOne = file[0];
        userInputTwo = file[1];
        spotifyAction();

    });

};

//Twitter Action - Return requests 
function twitterTime() {
    var Twitter = require('twitter');
    var client = new Twitter(keys.twitterKeys);
    var params = { screen_name: 'SharkWeek', count: "20" };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var key in tweets) {
                var twitterObj = tweets[key].text
                console.log("===========", twitterObj);
                logArray.push(twitterObj);
                console.log("Twitter Array",logArray);                
            }
            fs.appendFile('log.txt', JSON.stringify(logArray,null, 4), function(err) {
                if(err) {
                    return console.log(err);
                }

                console.log("Tweet Time!");
            }); 
        }
    });
}

//Spotify API Request and Return Object Function
function spotifyAction() {
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(keys.spotifyKeys);

    if (!userInputTwo) {
        userInputTwo = "Ace of Base";
    }

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

                console.log("Play my song!");
            }); 
    });
};


//Movie Database API Request and Return Object Function
//function to search a movie title and console log the information about the movie

function movieInfo () {
    if (!userInputTwo) {
        userInputTwo = "Batman+Begins";
    }
    request('http://www.omdbapi.com/?apikey=40e9cece&t=' + userInputTwo + `&tomatoes=true`, function (error, response, body) {
      var movieObj = JSON.parse(body);
      if (movieObj.Title === undefined && movieObj.Plot === undefined) {
        console.log("Sorry! Selection not found, try another title.");
      }
      else {
        console.log("Your movie Selection: ");
        console.log("Title: " + movieObj.Title);
        console.log("Year: " + movieObj.Year);
        console.log("Rating: " + movieObj.Rated);
        console.log("Country Produced In: " + movieObj.Country);
        console.log("Language: " + movieObj.Language);
        console.log("Plot: " + movieObj.Plot);
        console.log("Actors/Actresses: " + movieObj.Actors);
        console.log("Rotten Tomatoes URL: " + movieObj.tomatoURL);
      }
    });
  };
