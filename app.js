require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const sequelize = require('./src/utils/connectDB');
const userRouter = require('./src/route/userRouter');
const User = require('./src/model/userModel');
const { get } = require('express/lib/response');

//----------------------test------------------------

// middleware
app.use(express.json({ limit: '50mb' })); //body parser
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

sequelize.sync(); //create tables

//route
app.use('/api/users', userRouter);

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

app.listen(PORT, () => {
  console.log('server running on PORT ' + PORT);
});
