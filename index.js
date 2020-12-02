var Twitter = require('twitter');
var cron = require('node-cron');
const owo = require('owofy');
const { fetch, update } = require("./bin/DataHandler");
const config = require("./config.json");

// Twitter tokens and stuff
var client = new Twitter({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token_key: config.access_token_key,
    access_token_secret: config.access_token_secret
});

// Runs every 1 minute
cron.schedule('* * * * *', () => {
    console.log("Running cron");
    // Get's NOS tweets
    client.get('statuses/user_timeline', { screen_name: 'nos' }, function (error, tweets, response) {
        if (!error) {
            let newData = [];

            // Loops through tweet for db check
            for (let i = 0; i < tweets.length; i++) {
                let tweet = tweets[i];

                let id = tweet.id;

                let rawmsg = tweet.text;
                let msgUrlSplit = rawmsg.split(`https://t.co/`);

                let url = `https://t.co/${msgUrlSplit[1]}`;
                let msg = msgUrlSplit[0];

                // Fetches json file to check if the tweet was already tweeted!
                fetch().then(async function (cont) {
                    let allData = JSON.parse(cont);

                    if (!(allData.includes(id))) {
                        newData.push(id)
                        console.log(`I don't have ${id}`);

                        client.post('statuses/update', { status: `${owo(msg)} ${url}` }, function (error, tweet, response) {
                            if (!error) {
                                console.log("I tweeted!")
                            }
                        });
                    }

                    if ((i + 1) === tweets.length) {
                        finalNewData = newData.concat(allData)
                        update(JSON.stringify(finalNewData));
                    }
                })

                
            }
        }
    });
});