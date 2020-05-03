const fs = require('fs');

function fetchClasses()
{
  var lines = fs.readFileSync('./classes.txt').toString().split("\n");
  var arrayLength =lines.length;
  var wholeClasses = [];

  for(var i = 0; i < arrayLength; i++)
  {
    if(lines[i].includes("<th class=\"ddlabel\" scope=\"row\""))
    {
      var indexOfBeginning = lines[i].indexOf(">", lines[i].indexOf(">") + 1);
      var temp = lines[i].indexOf("<", lines[i].indexOf("<") + 1);
      var indexOfEnd = lines[i].indexOf("<", temp + 1);
      wholeClasses.push(lines[i].substring(indexOfBeginning + 1, indexOfEnd));
    }
  }
  return wholeClasses;
}

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

async function fetchTimesOfRecits(sectionName)
{
  var lines = fs.readFileSync('./classes.txt').toString().split("\n");
  var arrayLength =lines.length;
  var linesNumOfClass = 0;
  var toBeReturned = [];

  for(var i = 0; i < arrayLength; i++)
  {
    if(lines[i].includes(sectionName))
    {
      linesNumOfClass = i;
      break;
    }
  }

  for (x = linesNumOfClass + 1; x < arrayLength; x++)
  {
    if(lines[x].includes("<td class=\"dddefault\">") && (lines[x].includes(" am ") || lines[x].includes(" pm ") || lines[x].includes("TBA")))
    {
      indexOfBeginning = lines[x].indexOf(">");
      indexOfEnd = lines[x].indexOf("<", indexOfBeginning + 1);
      indexOfDayBegin = lines[x + 1].indexOf(">");
      indexOfDayEnd = lines[x + 1].indexOf("<", indexOfDayBegin + 1);
      toBeReturned = lines[x].substring(indexOfBeginning + 1, indexOfEnd) + " - " + lines[x + 1].substring(indexOfDayBegin + 1, indexOfDayEnd)
    }
    else if(lines[x].includes("</table>"))
    {
      break;
    }
  }
  return toBeReturned;
}

async function fetchDiscussionsAndRecitations(coursename)
{
  var courseRecit = coursename + "R";
  var courseDiscussion = coursename + "D";
  var courseLab = coursename + "L";

  var wholeClasses = fetchClasses();
  let toBeReturned = []
  for(var i = 0; i < wholeClasses.length; i++)
  {
    if(wholeClasses[i].includes(courseRecit) || wholeClasses[i].includes(courseDiscussion) || wholeClasses[i].includes(courseLab))
    {
      if(wholeClasses[i].includes('–'))
      {
        var classWithoutUnknownDash = wholeClasses[i].replace('–', '-');
        toBeReturned.push(classWithoutUnknownDash);
      }
      else
      {
        toBeReturned.push(wholeClasses[i]);
      }
    }
  }
  return toBeReturned;
}


async function fetchEmailOfInstructor(instructorname)
{
  var lines = fs.readFileSync('./classes.txt').toString().split("\n");
  var arrayLength = lines.length;
  nameArrayForEmailCheck = instructorname.split(" ");

  for(var i = 0; i < arrayLength; i++)
  {
    if(lines[i].includes(instructorname))
    {
      var matchGroup = lines[i].match(/<a href\="(.*?)"/g); 
      var matchGroupMarker = 0;
      for(var x = 0; x < matchGroup.length; x++)
      {
        for(var y = 0; y < nameArrayForEmailCheck.length; y++)
        {
          if(matchGroup[x].includes(nameArrayForEmailCheck[y].toLowerCase()))
          {
            var indexOfBegin = matchGroup[x].indexOf(":");
            var instructorEmail = matchGroup[x].substring(indexOfBegin + 1, matchGroup[x].length - 1);
            console.log(instructorEmail);
            return instructorEmail;
          }
        }
      }
    }
  }
}

module.exports = {
  fetchClasses,
  fetchInstructorsOfAClass,
  fetchTimesOfRecits,
  fetchDiscussionsAndRecitations,
  fetchEmailOfInstructor
}