var keys = require("./keys.js");
var Twitter = require("twitter");
var spotify = require("spotify");
var request = require('request');
var fs = require("fs")

var client = new Twitter(keys.twitterKeys);

var action = process.argv[2];

switch(action) {
    case "my-tweets":
        tweets();
        break;
    case "spotify-this-song":
        var song = process.argv[3];
        searchSong(song);
        break;
    case "movie-this":
        var movie = process.argv[3];
        searchMovie();
        break;
    case "do-what-it-says":
        var doIt = process.argv[3];
        doIt(doIt);
        break;
    default:
        console.log("Please check the input case was not found");
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

function searchSong(song) {

    var track = song || "The Sign";

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

function searchMovie(movie) {

    movieSplit = movie.trim().split(" ");
    var formatQuery = "";
    for(var word=0; word < movieSplit.length-1; word++) {
        formatQuery += movieSplit[word]+"-";
    }
    console.log(formatQuery);
    request("http://www.omdbapi.com/?t=+"formatQuery"+&tomatoes=true&r=json", function (error, response, body) {
    console.log('statusCode:', response); // Print the response status code if a response was received
 // console.log('body:', body); // Print the HTML for the Google homepage.
});
}

function doIt() {

}
