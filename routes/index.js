module.exports = function (app, PostGre) {
    require('../helpers/mailer')(app);
    var logWriter = require('../helpers/logWriter')();
    var badRequests = require('../helpers/badRequests')();
    var Session = require('../handlers/sessions');

    //Constants
    var RESPONSES = require('../constants/responseMessages');

    //Routers
    var usersRouter = require('./users')(PostGre, app);
    var session = new Session(PostGre);

    app.get('/', function (req, res, next) {
        res.sendfile('index.html');
    });


    function notFound(req, res, next) {
        res.status(404);

        if (req.accepts('html')) {
            return res.send(RESPONSES.PAGE_NOT_FOUND);
        }

        if (req.accepts('json')) {
            return res.json({error: RESPONSES.PAGE_NOT_FOUND});
        }

        res.type('txt');
        res.send(RESPONSES.PAGE_NOT_FOUND);
    }

    function errorHandler(err, req, res, next) {
        var status = err.status || 500;

          if (process.env.NODE_ENV === 'production') {
            if (status === 401) {
                logWriter.log('', err.message + '\n' + err.stack);
            }
            res.status(status);
        } else {
            if (status !== 401) {
                logWriter.log('', err.message + '\n' + err.stack);
            }
            res.status(status).send(err.message + '\n' + err.stack);
        }

        if (status === 401) {
            console.warn(err.message);
        } else {
            console.error(err.message);
            //console.error(err.stack);
        }
        console.error(err.message || err);
        res.status(status).send({error: err.message || err, stack: err.stack});
        next();
    }

    app.use(notFound);
    app.use(errorHandler);
};