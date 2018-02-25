const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
var session = require('express-session');
var crypto = require('crypto');
const app = express()
app.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000*60 },  //60 min
  rolling: true   //will refresh expiration period back to maxAge :D
}));
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(cors())

const mongodb_conn_module = require('./mongodbConnModule');
var db = mongodb_conn_module.connect();
require('../app/routes.js')(app);

app.listen(process.env.PORT || 8081)
