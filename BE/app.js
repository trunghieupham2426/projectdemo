require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const userRouter = require('./src/route/userRouter');
const classRouter = require('./src/route/classRouter');
const reminder = require('./src/utils/reminder');
const AppError = require('./src/utils/ErrorHandler/appError');
const globalErrHandler = require('./src/utils/ErrorHandler/globalErrHandler');

const app = express();
app.use(cors());

// reminder
cron.schedule('0 0 * * *', reminder); // run at 0h00 every day

// middleware
app.use(express.json({ limit: '50mb' })); //body parser
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//route
app.use('/api/users', userRouter);
app.use('/api/classes', classRouter);

//error handling
app.all('*', (req, res, next) => {
  return next(new AppError('cant find this route on server', 404));
});

app.use(globalErrHandler);

module.exports = app;
