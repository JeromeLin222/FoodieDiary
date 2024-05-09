'use strict';

const Data = require('../public/jsons/restaurant.json').results
const seedData = Data.map(data => {
  const { id, ...rest } = data
  return {
    ...rest,
    createdAt: new Date(),
    updatedAt: new Date()
  }
})


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('restaurants', seedData)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('restaurants', null)
  }
};
