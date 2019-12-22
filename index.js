const dialogflow = require("dialogflow");
const uuid = require("uuid");
require("dotenv").config();
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

mongoose.connect(process.env.DB, {
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
      var data = {
        name: "",
        age: "",
        breed: "",
        recurring: "",
        walkdate: "",
        bookingId: ""
      };
      console.log("Detected intent");
      const result = responses[0].queryResult;
      console.log(`  Query: ${req.body}`);
      console.log(`  Response: ${result.fulfillmentText}`);
      if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
        if(result.intent.displayName==="Name-Intent")
        {
          data.name=result.fulfillmentText.parameters.name
          data.bookingId=data.name+data.age+data.walkdate
        }
        if(result.intent.displayName==="Age-Intent")
        {
          data.age=result.fulfillmentText.parameters.age
          data.bookingId=data.name+data.age+data.walkdate
        }
        if(result.intent.displayName==="Breed-Intent")
        {
          data.breed=result.fulfillmentText.parameters.breed
          data.bookingId=data.name+data.age+data.walkdate
        }
        if(result.intent.displayName==="Date-Intent")
        {
          data.walkdate=result.fulfillmentText.parameters.date
          data.bookingId=data.name+data.age+data.walkdate
        }
        if(result.intent.displayName==="Recurring-Intent")
        {
          data.recurring=result.fulfillmentText.parameters.recurring
          data.bookingId=data.name+data.age+data.walkdate
        }
      } else {
        console.log(`  No intent matched.`);
      }
      if (responses) {
        const booking = new Booking(data)
        booking.save()
        .then((booking) => {
            res.send(booking)
        })
        .catch(err => res.send(err))
      }
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
});

app.listen(port, () =>
  console.log(`Example app listening on http://localhost:${port}!`)
);
