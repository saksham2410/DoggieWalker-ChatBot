const dialogflow = require("dialogflow");
const uuid = require("uuid");
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const app = express();
const query = 'Hello';
const port = 3000;
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:8080"
  })
);
const sessionId = uuid.v4();
const projectId = "dogiewalker-fjgbue";

const sessionClient = new dialogflow.SessionsClient({
  keyFilename: "DogieWalker-e8ad74546425.json"
});
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

mongoose.connect("mongodb+srv://Saksham2410:Saksham*1@zolostay-eosny.mongodb.net/test?retryWrites=true", {
    useNewUrlParser: true
}, function (error) {
    if (error) {
        console.log(error);
    } else {
        console.log("Connected to the Database");
    }
});
const {Booking} = require('./models/Booking');
app.post("/talk", (req, res) => {
  console.log(req.body);
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: req.body,
        languageCode: 'en-US'
      }
    }
  };

  sessionClient
    .detectIntent(request)
    .then(responses => {
      console.log("Detected intent");
      const result = responses[0].queryResult;
      console.log(`  Query: ${req.body}`);
      console.log(`  Response: ${result.fulfillmentText}`);
      if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
      } else {
        console.log(`  No intent matched.`);
      }
      if (responses) {
        // const booking = new Booking(body)
        // booking.save()
        // .then((booking) => {
        //     res.send(booking)
        // })
        // .catch(err => res.send(err))
        res.send({"intent": result.intent.displayName,"response": result.fulfillmentText});
      }
    }).then(

    )
    .catch(err => {
      console.error("ERROR:", err);
    });
});

app.listen(port, () =>
  console.log(`Example app listening on http://localhost:${port}!`)
);
