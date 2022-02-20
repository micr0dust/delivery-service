const createError = require('http-errors');
const cors = require('cors');
const express = require('express');
const path = require('path');
//const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const storeRouter = require('./routes/store');
const templatesRouter = require('./routes/templates');
const authedRouter = require('./routes/authed');
const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');
const rateLimiterMiddleware = require('./models/middleWave/rateLimite');

const app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/templates', templatesRouter);
app.use('/auth', authedRouter);
app.use('/admin', adminRouter);
app.get('/', function(req, res, next) {
    res.render('index', { title: 'Hello中原' });
});
app.use(rateLimiterMiddleware);
app.use('/member', indexRouter);
app.use('/store', storeRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;