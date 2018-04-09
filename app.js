var express = require("express");
var app = express();
const morgan = require('morgan');
var bodyParser = require("body-parser");

//Routes
const statusRoutes = require('./api/routes/status');
const devicesRoutes = require('./api/routes/devices');

//Add-ons
app.use(morgan('dev')); // logger
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Routes which should handle requests
app.use('/status', statusRoutes);
app.use('/devices', devicesRoutes);

//CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});


//Errors
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    }
  });
});

//Server
var server = app.listen(5000, function () {
    console.log("app running on port.", server.address().port);
});