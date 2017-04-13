//google api key: AIzaSyCkAzR6ixhqaGJLhoQXDmJ7zS67cTSD9Fk 
"use strict";
const express = require('express');
const dotenv = require('dotenv').config();
const mongo = require('mongodb').MongoClient;
const imgSearch = require('node-google-image-search');
const port = process.env.PORT || 8080;

var app = express();

app.get("/:query", function(req, res){
    let query = req.params.query;
    console.log(query);
var results = imgSearch(query, callback, 0 , 10);

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
}

});
app.listen(port);