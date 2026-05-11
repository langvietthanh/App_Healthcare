require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const { engine: handlebars } = require('express-handlebars');

const database = require('./config/db/index');
const router = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('common'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect DB
database.connect();

// Template Engine
app.engine('.hbs', handlebars({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resource', 'views'));

// Route
router(app);

// Error Handler
app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening on port ${process.env.PORT || 3000}`)
})