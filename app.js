require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const userRouter = require('./src/route/userRouter');
const classRouter = require('./src/route/classRouter');
const { sequelize, User, Class_Users, Class, Regis } = require('./src/models');

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

app.listen(PORT, async () => {
  console.log('server running on PORT ' + PORT);
  await sequelize.authenticate();
  console.log('Database Connected!');
});
