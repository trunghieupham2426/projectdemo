const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'admin1@gmail.com',
        username: 'admin1',
        phone: '113',
        age: 20,
        password: bcrypt.hashSync('123456', 8),
        isActive: '1',
        role: '1',
      },
      {
        email: 'user1@gmail.com',
        username: 'user1',
        phone: '111',
        age: 19,
        password: bcrypt.hashSync('123456', 8),
        isActive: '1',
      },
      {
        email: 'user2@gmail.com',
        username: 'user2',
        phone: '110',
        age: 21,
        password: bcrypt.hashSync('123456', 8),
        isActive: '1',
      },
      {
        email: 'user3@gmail.com',
        username: 'user3',
        phone: '112',
        age: 24,
        password: bcrypt.hashSync('123456', 8),
        isActive: '1',
      },
      {
        email: 'user4@gmail.com',
        username: 'user4',
        phone: '119',
        age: 24,
        password: bcrypt.hashSync('123456', 8),
        isActive: '1',
      },
      {
        email: 'user@gmail.com',
        username: 'user',
        phone: '119',
        age: 24,
        password: bcrypt.hashSync('123456', 8),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
