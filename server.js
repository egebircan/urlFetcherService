const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;
const fetchFunctions = require("./fetchFunctions");

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.json({"message": "Hello World"});
});

app.get('/getInstructors/:course', (req, res) => {
  fetchFunctions.fetchInstructorsOfAClass(req.params.course).then(function(value) {
    res.send(value)
  })
});

app.get('/getRecitationHours/:course', (req, res) => {
  fetchFunctions.fetchDiscussionsAndRecitations(req.params.course).then(function(value) {
    (async() => {
      let results = await Promise.all(
        value.map(val => fetchFunctions.fetchTimesOfRecits(val.split(" - ")[2] + " - " + val.split(" - ")[3]))
      )
      res.send(results)
    })();
  })
});

app.get('/getRecitationSections/:course', (req, res) => {
  fetchFunctions.fetchDiscussionsAndRecitations(req.params.course).then(function(value) {
    res.send(value.map(val => val.split(" - ")[3] + " - " + val.split(" - ")[4]))
  })
});

app.listen(port, () => {
  console.log(`Node server is listening on port ${port}`);
});

//console.log(fetchFunctions.fetchDiscussionsAndRecitations("IF 100"))
//console.log(fetchFunctions.fetchTimesOfRecits("IF 100R - A10"))