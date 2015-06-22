var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var http = require('http');
var bodyParser = require('body-parser');
var server = http.createServer(app);
var connectOptions;
var mainDb;
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')( session );
//var MainSchedule = require('./handlers/schedule');
var scheduler;


app.use(logger('dev'));
app.use( express.static( path.join(__dirname, 'public') ) );
app.use( bodyParser.json({strict: false, limit: 1024 * 1024 * 200}) );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser());


// todo for production

require('./config/development');

connectOptions = {
    //db: { native_parser: true },
    db: { native_parser: false },
    server: { poolSize: 5 },
    //replset: { rs_name: 'myReplicaSetName' },
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    w: 1,
    j: true,
    mongos: true
};


mainDb = mongoose.createConnection( process.env.DB_HOST, process.env.DB_NAME, process.env.DB_PORT, connectOptions );

mainDb.on( 'error', console.error.bind( console, 'connection error:' ) );
mainDb.once( 'open', function callback() {
    console.log( "Connection to " + process.env.DB_NAME + " is success" );

    app.use(session({
        secret: '111',
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({
            host: 'localhost',
            port: 27017,
            db: 'SenSeiDB',
            autoReconnect: true,
            ssl: false
        })
    }));

    require('./routes')(app, mainDb);

   /* scheduler = new MainSchedule(mainDb);
    scheduler.startMainCron();
*/
    server.listen(8831, function(){
        console.log('Server up successfully on port 8831');
    });
});