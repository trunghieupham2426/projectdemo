require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const sequelize = require('./src/utils/connectDB');
const userRouter = require('./src/route/userRouter');
const User = require('./src/model/userModel');

// middleware
app.use(express.json()); //body parser
app.use(express.static('public'));

sequelize.sync(); //create tables

//route
app.use('/api/users', userRouter);

app.listen(PORT, () => {
  console.log('server running on PORT ' + PORT);
});
