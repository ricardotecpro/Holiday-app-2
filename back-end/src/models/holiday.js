const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Holiday = sequelize.define('Holiday', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  countryCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {});

Holiday.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Holiday, { foreignKey: 'userId' });

module.exports = Holiday;
