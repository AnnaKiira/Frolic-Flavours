//Import Modules
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passUserToView = require('./middleware/pass-user-to-view.js')
const isSignedIn = require('./middleware/is-signed-in.js')

//Local Imports
const authController = require('./controllers/auth.js');
const recipesController = require('./controllers/recipes.js');
const usersController = require('./controllers/users.js');

//Middleware
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.use(passUserToView);

//Landing Page
app.get('/', (req, res) => {
    res.render('index', {
        user: req.session.user,
    });
});
  
app.use('/auth', authController);
  
app.use('/recipes', isSignedIn, recipesController);

app.use('/users', isSignedIn, usersController);

app.get('*', (req, res) => {
    res.render('404')
});


//Server Connections
const connect = async () => {
    try {
        //MongoDB Connection
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database Connection Established')
        //Express Server Connection
        app.listen(process.env.PORT, () => {
            console.log(`Server up & running on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

connect()
