require('dotenv').config();
const path = require('path');
const express = require ('express');
const app = express();
const morgan = require('morgan');
const {engine: handlebars} = require('express-handlebars');
const port = 3000;
const database = require('./config/db/index');
const router = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');

app.use(express.static(path.join(__dirname,'public')));
app.use(morgan('common'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Connect DB
database.connect();

// Template Engine
app.engine('.hbs', handlebars({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resource', 'views'));

// Route
router(app);

// Error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})