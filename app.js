require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const userRouter = require('./src/route/userRouter');
const classRouter = require('./src/route/classRouter');
const reminder = require('./src/utils/reminder');

const app = express();

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
  res.status(404).json({
    message: `cant find this route on server`,
  });
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
