//require modules
const express = require('express');
const morgan = require('morgan');
const eventRoutes = require('./routes/eventRoutes');
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');

//create app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
//let url = MongoURI;
app.set('view engine', 'ejs');

//Connect to MonogDB
mongoose.connect(url)
.then(() => {
    //start the server
    app.listen(port, host, ()=>{
    console.log('Server is running on port', port);
});
})
.catch(err => console.log(err.message));

//sessions
app.use(
    session({
        secret: "ajfeirf90aeu9eroejfoefj",
        resave: false,
        saveUninitialized: false,
        //store: new MongoStore({mongoUrl: mongoURI}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    res.locals.user = req.session.user||null;
    next();
});

//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use('/events', eventRoutes);
app.use('/', mainRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ('Internal server error');
    }
    res.status(err.status);
    res.render('error', {error: err});
});