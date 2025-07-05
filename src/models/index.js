import Sequelize from 'sequelize';
import dotenv from 'dotenv';

import createUserModel from './User.js';
import createHabitModel from './Habit.js';
import createHabitCompletionModel from './HabitCompletionModel.js';
import createTagModel from './Tag.js';
import createHabitTagModel from './HabitTag.js';

dotenv.config();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
});

const User = createUserModel(sequelize, Sequelize.DataTypes);
const Habit = createHabitModel(sequelize, Sequelize.DataTypes);
const HabitCompletion = createHabitCompletionModel(sequelize, Sequelize.DataTypes);
const Tag = createTagModel(sequelize, Sequelize.DataTypes);
const HabitTag = createHabitTagModel(sequelize, Sequelize.DataTypes);

User.hasMany(Habit, { foreignKey: 'userId' });
Habit.belongsTo(User, { foreignKey: 'userId' });

Habit.hasMany(HabitCompletion, {
    foreignKey: 'habitId',
    as: 'completions',
  });
  HabitCompletion.belongsTo(Habit, {
    foreignKey: 'habitId',
    as: 'habit',
  });
  

User.hasMany(HabitCompletion, { foreignKey: 'userId' });
HabitCompletion.belongsTo(User, { foreignKey: 'userId' });

Habit.belongsToMany(Tag, {
    through: HabitTag,
    as: 'tags',
    foreignKey: 'habitId',
});

Tag.belongsToMany(Habit, {
    through: HabitTag,
    as: 'habits',
    foreignKey: 'tagId',
});

sequelize
    .authenticate()
    .then(() => console.log('Conexão com o banco de dados estabelecida com sucesso.'))
    .catch((err) => console.error('Falha ao conectar ao banco:', err));

export { sequelize, User, Habit, HabitCompletion, Tag, HabitTag };
