const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { WebhookClient } = require("dialogflow-fulfillment");
const expressApp = express().use(bodyParser.json());

process.env.DEBUG = "dialogflow:debug";
const dburi =
  "<YOUR DB URL>";
mongoose.connect(dburi, { useNewUrlParser: true }).catch(err => {
  console.log("error occured", err);
});

mongoose.connection.on("connected", () => {
  console.log("App is connected with database.");
});

mongoose.connection.on("disconnected", () => {
  console.log("App disconnected with database.");
  process.exit(1);
});

var userDetail = new mongoose.Schema(
  {
    name: { type: String, required: true },
    bookingId: {type:String, required: true},
    age: { type: Number, required: true },
    breed: { type: String, required: true },
    recurring: { type: Number, required: true },
    walkdate: { type: Date, required: true }
  },
  { collection: "bookingInfo" }
);
var model = new mongoose.model("bookingInfo", userDetail);

expressApp.post("/webhook", function (request, response, next) {
  const agent = new WebhookClient({ request: request, response: response });

  function welcome(agent) {
    agent.add(`Good day! you want to book a appointment`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function walkBooking(agent) {
    const name = agent.parameters.name;
    const age = agent.parameters.age;
    const breed = agent.parameters.breed;
    const recurring = agent.parameters.recurring;
    const walkdate = agent.parameters.walkdate;
    const bookingId = agent.parameters.bookingId;

    console.log(name, persons, email);

    var data = {
      name: name,
      age: age,
      breed: breed,
      recurring: recurring,
      walkdate: walkdate,
      bookingId: bookingId
    };

    console.log(data);

    var saveData = new model(data);
    saveData.save((err, mydata) => {
      if (err) {
        console.log(err);
        agent.add(`Erroe while writing on database`);
      } else {
        agent.add(`Thanks! Dog ${name} request for ${walkdate} 
    have been forwarded we will contact you.`);
      }
    });

    agent.add(`Thanks! Dog ${name} your request for ${walkdate} 
    persons have forwarded we will contact you.`);
  }

  function showBooking(agent) {
    var bookingName = agent.parameters.bookingname;
    console.log("Booking Name:", bookingName);
    model.find({ bookingId: bookingId }, (err, mydata) => {
      if (err) {
        agent.add(`Erroe while looking on database`);
        console.log(err);
      } else {
        console.log("success show booking");
        agent.add(
          `Appointment added`
        );
      }
    });
  }

  function sendMail(agent) {

  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("WalkBooking", walkBooking);
  intentMap.set("ShowBooking", showBooking);

  agent.handleRequest(intentMap);
});
expressApp.listen(process.env.PORT || 3000, function () {
  console.log("app is running in 3000");
});