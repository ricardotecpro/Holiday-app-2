const bcrypt = require('bcrypt');
const sequelize = require('./config/database');
const User = require('./models/user');

async function initDatabase() {
  await sequelize.sync();

  const existingUser = await User.findOne({ where: { username: 'admin' } });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('123', 10);
    await User.create({ username: 'admin', passwordHash: hashedPassword });
    console.log('Usuário admin criado (login: admin, senha: 123)');
  } else {
    console.log('Usuário admin já existe');
  }

  const existingUser2 = await User.findOne({ where: { username: 'user2' } });
  if (!existingUser2) {
    const hashedPassword = await bcrypt.hash('123', 10);
    await User.create({ username: 'user2', passwordHash: hashedPassword });
    console.log('Usuário user2 criado (login: user2, senha: 123)');
  } else {
    console.log('Usuário user2 já existe');
  }
}


module.exports = initDatabase;
