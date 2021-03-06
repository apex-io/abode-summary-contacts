/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const faker = require('faker');
const mongoose = require('mongoose');
const {
  Agent,
  Property,
  save,
  find,
} = require('./entry.js');

const generateRandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const seedAgents = (quantity, title) => {
  const agents = [];
  for (let i = 0; i < quantity; i += 1) {
    agents.push(new Agent({
      name: faker.name.findName(),
      title,
      rating: generateRandomNum(3, 5),
      numSales: generateRandomNum(0, 30),
      phoneNum: faker.phone.phoneNumberFormat(0),
      email: faker.internet.email(),
    }));
  }
  return agents;
};

const numberWithCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const seedProperties = (quantity) => {
  const properties = [];

  const now = new Date();
  const oneMonth = new Date();
  oneMonth.setMonth(now.getMonth() + 1);

  for (let i = 0; i < quantity; i += 1) {
    const randomPrice = generateRandomNum(5000, 40000) * 100;
    properties.push(new Property({
      address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.zipCode()}`,
      numBd: generateRandomNum(1, 5),
      numBa: generateRandomNum(1, 5),
      sqft: numberWithCommas(generateRandomNum(10, 30) * 100),
      marketValEst: numberWithCommas(randomPrice),
      monthlyPayment: numberWithCommas(Math.floor(randomPrice / 360)),
      contact: seedAgents(1, 'Seller\'s Agent').concat(seedAgents(3, 'Premier Agent')),
    }));
  }
  return properties;
};

find({}, (docs) => {
  const quantity = 100 - docs.length;
  if (docs.length >= 0 && docs.length < 100) {
    const data = seedProperties(quantity);
    const saves = data.map((property) => {
      return save(property);
    });
    Promise.all(saves).then(() => {
      console.log(`Database seeded with ${quantity} property entries`);
      mongoose.connection.close();
    });
  } else {
    console.log('Database contains sufficient seeded data');
  }
});

module.exports = {
  seedProperties,
};
