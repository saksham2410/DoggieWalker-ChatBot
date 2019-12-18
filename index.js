const dialogflow = require("dialogflow");
const uuid = require("uuid");
const express = require("express");
const app = express();
const query = 'Hello';
const port = 3000;

// app.use(express.static('public'));
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());

const sessionId = uuid.v4();
const projectId = "dogiewalker-fjgbue";

const sessionClient = new dialogflow.SessionsClient({
  keyFilename: "DogieWalker-e8ad74546425.json"
});
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

app.post("/talk", (req, res, next) => {
  console.log(req.body.query);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: req.body.query,
        languageCode: 'en-US'
      }
    }
  };

  sessionClient
    .detectIntent(request)
    .then(responses => {
      console.log("Detected intent");
      const result = responses[0].queryResult;
      console.log(`  Query: ${req.body.query}`);
      console.log(`  Response: ${result.fulfillmentText}`);
      if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
      } else {
        console.log(`  No intent matched.`);
      }
      if (responses) {
        res.send({"intent": result.intent.displayName,"response": result.fulfillmentText});
      }
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
});

app.listen(port, () =>
  console.log(`Example app listening on http://localhost:${port}!`)
);
