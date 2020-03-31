const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const port = 4000;

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
  fetchInstructorsOfAClass(req.params.course).then(function(value) {
    res.send(value)
  })
});

app.listen(port, () => {
  console.log(`Node server is listening on port ${port}`);
});

async function fetchInstructorsOfAClass(coursename)
{
  var instructors = [];
  var lines = fs.readFileSync('./classes.txt').toString().split("\n");
  var lineNumOfCourse = 0;

  for(var i = 0; i < lines.length; i++)
  {
    if(lines[i].includes("<th class=\"ddlabel\" scope=\"row\""))
    {
      var indexOfBeginning = lines[i].indexOf(">", lines[i].indexOf(">") + 1);
      var temp = lines[i].indexOf("<", lines[i].indexOf("<") + 1);
      var indexOfEnd = lines[i].indexOf("<", temp + 1);
      if (lines[i].substring(indexOfBeginning + 1, indexOfEnd).includes(coursename))
      {
        lineNumOfCourse = i;
        break;
      }
    }
  }

  for(var i = lineNumOfCourse + 1; i < lines.length; i++)
  {
    if(lines[i].includes("<a href=\"mailto:"))
    {
      var matchGroup = lines[i].match(/target\="(.*?)"/g);
      for(var i = 0; i < matchGroup.length; i++)
      {
        var instructorName = matchGroup[i].match(/(?<=\")(.*?)(?=\")/g);
        instructors.push(...instructorName)
      }
      break;
    }
  }
  return instructors
}