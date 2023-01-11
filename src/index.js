const express = require('express');
const { Client } = require('pg');
const app = express();

// Enable JSON parsing for incoming requests
app.use(express.json());

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

app.get("/", (req, res) => {
  //when we get an http get request to the root/homepage
  res.send("Hello World");
});

app.post('/add-tweet', (req, res) => {
  // Extract the tweet data from the request body
  const { tweetId, tweetUrl, tweetAuthor, tweetTagAuthor, tweetTagId } = req.body;
  console.log("Request body: " + req.body);
  console.log("Recieved info: TweetID: " + tweetId + " TweetURL: " +tweetUrl + " TweetAuthor: " + tweetAuthor + " TweetTagAuthor: " + tweetTagAuthor + " TweetTagID: " + tweetTagId);
  // Insert the tweet into the database
  client.query(
    `INSERT INTO tweets (tweetId, tweetUrl, tweetAuthor, tweetTagAuthor, tweetTagId) VALUES ('${tweetId}', '${tweetUrl}', '${tweetAuthor}', '${tweetTagAuthor}', '${tweetTagId}')`,
    (error, results) => {
      if (error) {
        res.status(500).send(error.message);
      } else {
        res.send({ message: 'Tweet added successfully' });
      }
    }
  );
});

app.get('/tweets', (req, res) => {
  // Retrieve all the tweets from the database
  client.query('SELECT * FROM tweets', (error, results) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      res.send(results);
    }
  });
});

// Return last seen tweet
app.get('/last-seen', (req, res) => {
  // Retrieve all the tweets from the database
  client.query('SELECT * FROM tweets ORDER BY id DESC LIMIT 1', (error, results) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      res.send(results);
    }
  });
});

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});