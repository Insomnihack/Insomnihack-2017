var express          = require('express');
var expressSession   = require('express-session')
var exphbs           = require('express-handlebars');
var expressValidator = require('express-validator');
var favicon          = require('serve-favicon');
var bodyParser       = require('body-parser');
var cookieParser     = require('cookie-parser');
var path             = require('path');
var logger           = require('morgan');
var RedisStore       = require('connect-redis')(expressSession);
var config           = require('./config')

// import routes
var index = require('./routes/index');

// initialize express app
var app = express();

app.engine('handlebars', exphbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.disable('x-powered-by');
// app.enable('view cache');

// setup middleware
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(expressSession({secret: config.session.secret, saveUninitialized: false, resave: false}));
app.use(expressSession({
    name: config.session.name,
    secret: config.session.secret,
    saveUninitialized: false,
    resave: false,
    cookie: {
        path: '/',
        httpOnly: false, // set to false is no ssl
        secure: false,   // idem
        maxAge: 60 * 60000, // 60m
        signed: false
    },
    store: new RedisStore({
        host: config.redis.host,
        port: config.redis.port,
        ttl: 260,
        pass: config.redis.pass
    })
}));

// import routes
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {error: err});
});

module.exports = app;
