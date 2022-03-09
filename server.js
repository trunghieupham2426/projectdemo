require('dotenv').config();
const { sequelize } = require('./src/models');
const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
  console.log(`server running on port ${PORT}`);
  await sequelize.authenticate();
  console.log('Database Connected!');
});

module.exports = server;
