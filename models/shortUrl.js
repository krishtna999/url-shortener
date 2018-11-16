var mongoose=require('mongoose');
var ttl=require('mongoose-ttl');
autoIncrement = require('mongoose-auto-increment');

mongoose.connect('mongodb://admin123:admin123@ds261253.mlab.com:61253/url-shortener',{ useNewUrlParser: true } );
var db=mongoose.connection;
autoIncrement.initialize(db);

db.on('error', console.error.bind(console, 'connection error:')); //incase of error
var urlSchema=new mongoose.Schema({
    // url: String,
    _id:String,
    url: [{
        type: String
    }],
    shortUrl: String,
    ldate: {type:Date,expires:'12d',default: Date.now}       //createdAt Date
});

urlSchema.plugin(autoIncrement.plugin,'url');
// urlSchema.plugin(ttl,{ttl:'14d',});
var url=mongoose.model('url',urlSchema);

module.exports=url;

