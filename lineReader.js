/*
lineReader will extract the records from amazon-meta.txt one at a time as
file is too large to read all at once.  In order to add records to a database you need to add code below to insert records

This code depnds on "line-reader"

You need to install line-reader by using the following command:
npm install line-reader

*/
var lineReader = require('line-reader');

var record = new Object();
record.categories = [];
var jsonRecord;
var already = false;
var categories = false;

lineReader.eachLine('amazon-meta.txt', function(line, last) {

  if(line.indexOf("Id:")>=0){
    if(already){

      //create JSON object for complete record
      jsonRecord = JSON.stringify(record);
      console.log(jsonRecord);


      /****************************************
      *****************************************
      add code to insert record in your db here
      *****************************************
      ****************************************/


      //reinitialize record and add Id value
      record = new Object();
      record.categories = [];
      record.Id = subStr;


    } else {
      //For the first record read Id and record it
      var subStr = line.substring(line.indexOf("Id:")+3,line.indexOf("\r")).trim();
      record.Id = subStr;

      //inidicate that the Id value has been captured so that the next Id value indicates end of current record
      already = true;
      //console.log(record.Id);
    }

  }

  if(line.indexOf("ASIN:")>=0){
    //record the ASIN
    var subStr = line.substring(line.indexOf("ASIN:")+5,line.indexOf("\r")).trim();
    record.ASIN = subStr;
    //console.log(record.ASIN);
  }

  if(line.indexOf("title:")>=0){
    //record the title
    var subStr = line.substring(line.indexOf("title:")+6,line.indexOf("\r")).trim();
    record.title = subStr;
  }

  if(line.indexOf("group:")>=0){
    //record the group
    var subStr = line.substring(line.indexOf("group:")+6,line.indexOf("\r")).trim();
    record.group = subStr;
  }

  if(line.indexOf("categories:")>=0 || line.indexOf("reviews:")>0 || categories){
    //Check if there are more categories to record and make sure we haven't started reading reviews
    if((line.indexOf("categories:")>=0||categories) && !(line.indexOf("reviews:")>0)){
      //record the categories -- there might be more than one category so have to continue reading until we get to "reviews"
      var subStr = line.substring(line.indexOf("categories:")+11,line.indexOf("\r")).trim();
      record.categories.push(subStr) ;
      categories = true;
    } else {
      categories = false;
    }

  }



 if (last) {
    return false; // stop reading
  }
});
