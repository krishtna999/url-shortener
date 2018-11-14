var mongoose=require('mongoose');

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
    ldate: {type:Date,default: Date.now}
});

urlSchema.plugin(autoIncrement.plugin,'url');
var url=mongoose.model('url',urlSchema);

module.exports=url;

