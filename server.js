var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// var open = require("opn");
var shortUrl = require('./models/shortUrl');
var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

function open(url) {
    console.log("In open !");
    // var url = 'http://localhost';
    var start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
    require('child_process').exec(start + ' ' + url);


}

app.get('/', function (req, res) {
    // console.log('YOLO');
    res.render('home', { urlPath: "" });

});

app.get(/.*;.*/, function (req, res) {
    // localhost:8080   /lol;https://unix.stackexchange.com/questions/106561/finding-the-pid-of-the-process-using-a-specific-port;https://duckduckgo.com/?q=url+reg+exp&t=ffab&ia=web;https://www.regextester.com/20
    console.log("haha");
    var urlStr = req.url;
    console.log(urlStr);
    var fields = urlStr.split(';');
    var shortened = fields[0].split('/')[1];
    // console.log("Split By ;\t1::"+fields[0]+"\t2::"+fields[1]);
    console.log("Fields Length :" + fields.length);
    console.log("Printing fields each in new line :\n");
    console.log(shortened);

    if (/^[a-zA-z0-9]*$/.test(shortened) == false) {
        console.log("Failed Regex, Sending back to home");
        res.render('home', { urlPath: "This URL has illegal characters in it and hence is not allowed !" });
    }

    var urls = new Array;
    var urlIndex = 0;
    for (i = 1; i < fields.length; i++) {
        //  TODO : validation of url 
        // if (/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/.test(fields[1])) {
        urls[urlIndex] = fields[i];
        urlIndex++;
        // }
    }
    for (i = 0; i < urls.length; i++) {
        console.log(urls[i]);
    }

    // console.log("New URL ENTRY \tNo. of Urls :" + req.body.longUrl.length + "\tShortened to:" + shortened);
    var longUrl = urls;
    shortUrl.findOne({ shortUrl: shortened }, function (err, data) {
        if (data != null) {
            //check if already exists

            res.render('home', { urlPath: "URL_already_exists" });
        }
        else {
            var newUrl = new shortUrl({ url: longUrl, shortUrl: shortened });
            newUrl.save(function (err, newUrl) {
                console.log("saved!");
                res.render('success', { shortUrl: shortened, urls: longUrl });
            });
        }
    });
});


app.get('/:path', function (req, res) {

    var path = req.params.path;
    if (/^[a-zA-z0-9]*$/.test(path) == false) {
        console.log("Failed Regex, Sending back to home");
        res.render('home', { urlPath: "This_URL_has_illegal_characters!" });
    }
    console.log("Got a path request to :" + path);
    shortUrl.findOne({ shortUrl: path }, function (err, data) {
        // if(data.length>0){
        if (data == null) {
            console.log("NOT FOUND !");
            res.render('home', { urlPath: path });
        }
        else {
            // console.log("Found a match and redirect to :" + data.url.length);
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

    //If custom path was left empty
    if (shortened == "") {
        shortUrl.findOne().sort({ ldate: -1 }).exec(function (err, data) {
            var nid = data._id;
            nid++;
            nid += 6969;
            shortened = nid.toString(36);
            shortUrl.findOne({ shortUrl: shortened }, function (err, data) {
                if (data != null) {
                    //check if already exists
                    nid -= 6000;      //6000 is arbitrary
                    shortened = nid.toString(36);
                    var newUrl = new shortUrl({ url: req.body.longUrl, shortUrl: shortened });
                    newUrl.save(function (err, newUrl) {
                        console.log("saved!");
                        res.render('success', { shortUrl: shortened, urls: req.body.longUrl });
                    });
                    res.render('home', { urlPath: shortened });
                }
                else {
                    //If doesn't exist then proceed

                    var newUrl = new shortUrl({ url: req.body.longUrl, shortUrl: shortened });
                    newUrl.save(function (err, newUrl) {
                        console.log("saved!");
                        res.render('success', { shortUrl: shortened, urls: req.body.longUrl });
                    });
                }
            });
        });
    }
    // console.log("New URL ENTRY \tNo. of Urls :" + req.body.longUrl.length + "\tShortened to:" + shortened);
    shortUrl.findOne({ shortUrl: shortened }, function (err, data) {
        if (data != null) {
            //check if already exists

            res.render('home', { urlPath: "URL_already_exists" });
        }
        else {
            var newUrl = new shortUrl({ url: req.body.longUrl, shortUrl: shortened });
            newUrl.save(function (err, newUrl) {
                console.log("saved!");
                res.render('success', { shortUrl: shortened, urls: req.body.longUrl });
            });
        }
    });
});


var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});
