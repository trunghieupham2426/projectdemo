module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Regis', [
      {
        classId: '1',
        userId: '1',
        status: 'pending',
      },
      {
        classId: '1',
        userId: '2',
        status: 'pending',
      },
      {
        classId: '1',
        userId: '3',
        status: 'pending',
      },
      {
        classId: '1',
        userId: '4',
        status: 'pending',
      },
      {
        classId: '2',
        userId: '4',
        status: 'pending',
      },
      {
        classId: '2',
        userId: '3',
        status: 'pending',
      },
      {
        classId: '2',
        userId: '2',
        status: 'cancel',
      },
      {
        classId: '2',
        userId: '1',
        status: 'cancel',
      },
      {
        classId: '3',
        userId: '1',
        status: 'cancel',
      },
      {
        classId: '3',
        userId: '2',
        status: 'pending',
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
