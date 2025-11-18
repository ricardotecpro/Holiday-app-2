const sequelize = require('../config/database');
const User = require('./user');
const Holiday = require('./holiday');

const syncDatabase = async () => {
  try {
    await sequelize.sync();
    console.log("Banco sincronizado com sucesso!");
  } catch (err) {
    console.error("Erro ao sincronizar o banco:", err);
  }
};

module.exports = {
  sequelize,
  User,
  Holiday,
  syncDatabase
};
