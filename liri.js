// get API KEY
require("dotenv").config();

var keys = require("./keys.js");
var request = require('request');
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var command = process.argv[2];
var input = process.argv[3];

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//command options
switch (command) {
    case "my-tweets":
    twitterShow(input);
    break;

    case "spotify-this-song":
    spotifySearch(input);
    break;

    case "movie-this":
    movieSearch(input);
    break;

    case "do-what-it-says":
    doWhatItSay();
    break;
};


//function runs in command
function twitterShow(input){
    // display 20 tweets
    var params = {count: 20};
	
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (i = 0; i < tweets.length; i ++){
                console.log("@" + tweets[i].user.screen_name + "-Tweet"+ (i+1) + ": " + tweets[i].text + "\n Created At: " + tweets[i].created_at);
                console.log("=================================================================")
            }
        } else { 
            console.log(error);
        }
    });
};

function spotifySearch(input){
    // if the user doesnt put any song name in command
    if(!input){
        input = "The Sign";
    }

    spotify.search({ type: 'track', query: input, limit: 5 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        
        for (i = 0; i < data.tracks.items.length; i++) {
            var info = data.tracks.items;
	        console.log("Artist(s): " + info[i].artists[0].name);
	        console.log("Song Name: " + info[i].name);
	        console.log("Preview Link: " + info[i].preview_url);
            console.log("Album: " + info[i].album.name);
            console.log("=================================================================")
        }
    });
};

function movieSearch(input){
    if (input === undefined) {
        input = "Mr. Nobody";
    }

    var queryUrl = " http://www.omdbapi.com/?t=" + input + "&apikey=acedd2";
    
    request(queryUrl, function(error, response, body) {
		
		if (!error && response.statusCode === 200) {

		    console.log("Title: " + JSON.parse(body).Title);
		    console.log("Release Year: " + JSON.parse(body).Year);
		    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
		    console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("=================================================================")
        }

        if(input === "Mr. Nobody"){
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
            console.log("*****************************************************************");
        }
	});
};


function doWhatItSay(){
    fs.readFile('random.txt', "utf8", function(error, data){

		if (error) {
    		return console.log(error);
  	}

		// Then split it by commas (to make it more readable)
		var dataArr = data.split(",");

		// Each command is represented. Because of the format in the txt file, remove the quotes to run these commands. 
		if (dataArr[0] === "spotify-this-song") {
			var songcheck = dataArr[1].slice(1, -1);
			spotifySearch(songcheck);
		} else if (dataArr[0] === "my-tweets") {
			var tweetname = dataArr[1].slice(1, -1);
			twitterShow(tweetname);
		} else if(dataArr[0] === "movie-this") {
			var movie_name = dataArr[1].slice(1, -1);
			movieSearch(movie_name);
		} 
		
});

};