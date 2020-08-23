// CRUD create read update delete

const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

// connecting server parameters url, options and callback function
MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, client) => {
    // checkin for errors
    if (error) return console.log("unable to connect to database");
    // using client method to connect database
    const db = client.db(databaseName);
  }
);
