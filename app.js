const swaggerUi = require('swagger-ui-express');
const createError = require('http-errors');
//const cors = require('cors');
const express = require('express');
const path = require('path');
//const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const storeRouter = require('./routes/store');
const businessRouter = require('./routes/business');
const groupRouter = require('./routes/group');
const templatesRouter = require('./routes/templates');
const authedRouter = require('./routes/authed');
const shopRouter = require('./routes/shop');
const homeRouter = require('./routes/home');
const backendRouter = require('./routes/admin');
const usersRouter = require('./routes/users');
const rateLimiterMiddleware = require('./models/middleWave/rateLimite');

const app = express();
const swaggerDocument = require('./api-docs.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/templates', templatesRouter
    // #swagger.ignore = true
);
app.use('/auth', authedRouter
    // #swagger.ignore = true
);
app.use('/shop', shopRouter
    // #swagger.ignore = true
);
app.use('/admin', homeRouter
    // #swagger.ignore = true
);
app.get('/', function(req, res, next) {
    // #swagger.ignore = true
    res.render('index', { title: 'Hello中原' });
});
app.use(rateLimiterMiddleware);
app.use('/member', indexRouter
    // #swagger.tags = ['member']
);
app.use('/store', storeRouter
    // #swagger.tags = ['store']
);
app.use('/business', businessRouter
    // #swagger.tags = ['business']
);
app.use('/group', groupRouter
    // #swagger.tags = ['group']
);
app.use('/backend', backendRouter
    // #swagger.tags = ['backend']
);
app.use('/users', usersRouter
    // #swagger.ignore = true
);

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