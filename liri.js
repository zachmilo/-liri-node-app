var keys = require("./keys.js");
var Twitter = require("twitter");
var spotify = require("spotify");
var request = require('request');
var fs = require("fs");

var client = new Twitter(keys.twitterKeys);

var action = process.argv[2];

command(action);

function command(action) {

    switch(action) {
        case "my-tweets":
            tweets();
            break;
        case "spotify-this-song":
            searchSong();
            break;
        case "movie-this":
            searchMovie();
            break;
        case "do-what-it-says":
            doIt();
            break;
        default:
            console.log("Please check the input case was not found");
    }
}
function tweets() {

    client.get("statuses/home_timeline","trim_user=true")
      .then(function (data) {
        for (tweet in data) {
            var formatDate = new Date(data[tweet].created_at);
            var formatTime = formatDate.getHours() + ":" + formatDate.getMinutes();

            console.log("* "+formatDate.toDateString()+" "+formatTime);
            console.log("* "+ data[tweet].text+"\n");
        }
      })
      .catch(function (error) {
        throw error;
      })
}

function searchSong() {

    var song = multiParam() || "The Sign";
    spotify.search({ type: "track", query: song }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        var spotifyJams = data.tracks.items;
        for(result in spotifyJams){
            console.log("* Artist: "+spotifyJams[result].artists["0"].name);
            console.log("* Track: "+spotifyJams[result].name);
            console.log("* Link: "+spotifyJams[result].preview_url);
            console.log("* Album: "+spotifyJams[result].album.name+"\n");
        }
    });
}

function searchMovie() {
    var movie = multiParam();
    movieSplit = movie.trim().split(" ");
    var formatQuery = ""
    if(movieSplit.length > 1) {
        for(var word = 0; word < movieSplit.length-1; word++) {
            formatQuery += movieSplit[word]+"-";
        }
    }
    else
    {
        formatQuery = movieSplit[0];
    }
    request("http://www.omdbapi.com/?t="+formatQuery+"&tomatoes=true&r=json", function (error, response, body) {
        var result = JSON.parse(body);
        console.log("* Title: "+result.Title);
        console.log("* Year of Release: "+result.Year);
        console.log("* Country: "+result.Country);
        console.log("* Language: "+result.Language);
        console.log("* Actors: "+result.Actors);
        console.log("* Rotten Tomatoes: "+result.tomatoUrl);
    });
}
function multiParam() {
    var builtParam ="";
    if(process.argv.length < 4) {
        builtParam = process.argv[3];
    }

    for (var param = 3; param < process.argv.length; param++) {
        builtParam+=process.argv[param]+" ";
    }
    //console.log(builtParam);
    return builtParam;
}
function doIt() {
    fs.readFile('random.txt', 'utf8', function(error, data){

        var format = data.trim().split(",");
        process.argv.push(format[1]);
        command(format[0]);
    });
}
