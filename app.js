var express = require('express');
var path = require('path');
var cons = require('consolidate');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var http = require('http');
var session = require('express-session');
var MemoryStore = require('connect-redis')(session);

var port;
var server;
var config;
var Models;

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(logger('dev'));
app.use(bodyParser.json({strict: false, inflate: false, limit: 1024 * 1024 * 200}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


if (app.get('env') === 'development') {
    require('./config/development');
} else {
    require('./config/production');
}

config = {
    db: 7,
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT) || 6379
};

app.use(session({
    name: 'testCall',
    secret: '1q2w3e4r5tdhgkdfhgejflkejgkdlgh8j0jge4547hh',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000  * 60 *  60 * 24 * 7 * 31
    },
    store: new MemoryStore(config)
}));



Models = require('./models/index');
Collections = require('./collections/index');

var uploaderConfig = {
    type: process.env.UPLOADING_TYPE,
    directory: 'public'//,
   /* awsConfig: {
        accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
        secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
        imageUrlDurationSec: 60 * 60 * 24 * 365 * 10
    }*/
};

port = parseInt(process.env.PORT) || 8835;
server = http.createServer(app);

server.listen(port, function () {
    console.log('Express start on port ' + port);
});

module.exports = app;