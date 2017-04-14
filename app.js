
"use strict";
const express = require('express');
const dotenv = require('dotenv').config();
const mongo = require('mongodb').MongoClient;
const moment = require("moment");
const imgSearch = require('node-google-image-search');
const port = process.env.PORT || 8080;

var app = express();

app.get("/api/:query", function(req, res){
  mongo.connect("mongodb://" + process.env.MONGO_USER + ":" + process.env.MONGO_PASS +"@ds161190.mlab.com:61190/imgsrch", function(err, db){
    if(err) console.log(err);
    
    let query = req.params.query;
    let offset = req.query.offset === undefined ? 0 : req.query.offset;
    let time = moment().format();
    let search = {
      term: query,
      when: time
    };
    
    var results = imgSearch(query, callback, offset , 10);
    
    function callback(results) {
      let arr = [];
      results.forEach(function(el){
        let obj = {};
        obj["url"] = el.link;
        obj["snippet"] = el.snippet;
        obj["thumbnail"] = el.image.thumbnailLink;
        obj["context"] = el.image.contextLink;
        arr.push(obj);
      });
      res.send(arr);
      db.collection("recent").insert(search, function(err, data){
        if(err) throw err;
        db.close();
      });
    }
  });
});

app.get("/recent", function(req, res){
  mongo.connect("mongodb://" + process.env.MONGO_USER + ":" + process.env.MONGO_PASS +"@ds161190.mlab.com:61190/imgsrch", function(err, db){
    if(err) console.log(err);
    db.collection("recent").find({}, {_id: 0, term: 1, when: 1}).sort({when: -1}).limit(10).toArray(function(err, data){
      if (err) throw err;
      res.send(data);
      db.close();
    });
    
    
  })
})
app.listen(port);