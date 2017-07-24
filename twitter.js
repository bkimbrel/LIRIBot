var Twitter = require("twitter");
var UserTwitter = function(keys)

{
  this.getTweets = function (screenName) 

  {
    var params = 
    {
    screen_name:screenName
    }

    var client = new Twitter(keys);
    client.get("statuses/user_timeline", params, function(error, tweets, response){
      if (!error){
        for (var i = 0; i < tweets.length; i++) {
          var tweet = tweets[i]
          console.log("tweet",i+1,tweet.text)
        }
      }

      else {
        console.log(error)
      }
    });

  }
}

module.exports = UserTwitter;