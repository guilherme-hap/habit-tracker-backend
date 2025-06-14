import Sequelize from 'sequelize';
import createUserModel from './User.js';
import createHabitModel from './Habit.js';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const User = createUserModel(sequelize, Sequelize.DataTypes);
const Habit = createHabitModel(sequelize, Sequelize.DataTypes);

User.hasMany(Habit, { foreignKey: 'userId' });
Habit.belongsTo(User, { foreignKey: 'userId' });

sequelize.authenticate()
  .then(() => console.log('Conexão com o banco de dados estabelecida com sucesso.'))
  .catch(err => console.error('Não foi possível conectar ao banco de dados:', err));

export { sequelize, User, Habit };
