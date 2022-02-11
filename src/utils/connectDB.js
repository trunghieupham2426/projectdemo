require('dotenv').config();
//set up SEQUELIZE
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  'projectdemo',
  'root',
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // tat log query
  }
);

// test connect db
(async function testConnectDB() {
  try {
    await sequelize.authenticate();
    console.log('Connection successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
