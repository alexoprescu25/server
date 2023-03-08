const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      expressLayouts = require('express-ejs-layouts');

const errorPageController = require('./controller/404');

const MONGODB_URI = 'mongodb+srv://admin:VfdHGYLA9QtCyYjC@cluster0.vsiavi9.mongodb.net/?retryWrites=true&w=majority';
    
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(expressLayouts);
app.set('layout', './layout/layout');

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