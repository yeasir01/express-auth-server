"use strict";

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();
const production = app.get('env') === 'production';

const PORT = process.env.PORT || 5000;
const MONGO_URL = production ? process.env.MONGODB_URL : 'mongodb://localhost/express-auth-server';
const MONGO_OPT = {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false
};

if ( !production ) {
    require('dotenv').config();
    app.use(morgan('tiny'));
    console.log('Development Mode');
};

mongoose.connect(MONGO_URL, MONGO_OPT)
    .then(() => console.log('Sucessfully connected to DB'))
    .catch(e => console.log('Unable to connect to DB: ', e))

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use(express.static('public'));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/", require("./routes/static/views"));

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
});
