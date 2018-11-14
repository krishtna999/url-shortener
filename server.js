var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var open = require("opn");
var shortUrl = require('./models/shortUrl');
var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.listen(4002);

app.get('/favicon.ico', function (req, res) {
    console.log("Favicon Requested !");
});


app.get('/', function (req, res) {
    // console.log('YOLO');
    res.render('home', { urlPath: "" });

});

app.get('/:path', function (req, res) {
    // console.log("LOLK");
    var path = req.params.path;
    console.log("Got a path request to :" + path);
    shortUrl.findOne({ shortUrl: path }, function (err, data) {
        // if(data.length>0){
        if (data == null) {
            console.log("NOT FOUND !");
            res.render('home', { urlPath: path });
        }
        else {
            console.log("Found a match and redirect to :" + data.url.length);
            for (i = 1; i < data.url.length; i++) {
                console.log("Opening :" + data.url[i]);
                open(data.url[i]);
            }
            res.redirect(data.url[0]);
        }
    });
});

app.post('/newUrl', function (req, res) {
    var shortened = req.body.custom;
    if (shortened == "") {
        shortUrl.findOne().sort({ ldate: -1 }).exec(function (err, data) {
            var nid = data._id;
            nid++;
            nid+=6969;
            shortened=nid.toString(36);
            var newUrl = new shortUrl({ url: req.body.longUrl, shortUrl: shortened });
            newUrl.save(function (err, newUrl) {
                console.log("saved!");
                res.render('success', { shortUrl: shortened, urls: req.body.longUrl });
            });
        });
    }
    // console.log("New URL ENTRY \tNo. of Urls :" + req.body.longUrl.length + "\tShortened to:" + shortened);
    var newUrl = new shortUrl({ url: req.body.longUrl, shortUrl: shortened });
    newUrl.save(function (err, newUrl) {
        console.log("saved!");
        res.render('success', { shortUrl: shortened, urls: req.body.longUrl });
    });
});