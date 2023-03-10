const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      expressLayouts = require('express-ejs-layouts'),
      multer = require('multer'),
      path = require('path'),
      session = require('express-session'),
      MongoDBStore = require('connect-mongodb-session')(session);

const MONGODB_URI = 'mongodb+srv://admin:VfdHGYLA9QtCyYjC@cluster0.vsiavi9.mongodb.net/?retryWrites=true&w=majority';

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const errorPageController = require('./controller/404');

const authRoutes = require('./routes/auth'),
      myAccountRoutes = require('./routes/my-account');
    
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './images');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
  });

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const app = express();

app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(expressLayouts);
app.set('layout', './layout/layout');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'session-secret', 
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
})

app.use(authRoutes);
app.use('/my-account', myAccountRoutes);
app.use(errorPageController.get404Page);

const PORT = 8000;

const rqListener = () => {console.log(`Server is listening on port ${PORT}!`)};

mongoose.connect(MONGODB_URI)
    .then(() => {
        app.listen(PORT, rqListener);
    })
    .catch((err) => {
        console.log(err);
    })