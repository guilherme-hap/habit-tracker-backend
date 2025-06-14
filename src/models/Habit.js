
export default (sequelize, DataTypes) => {
  const Habit = sequelize.define('Habit', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    frequency: DataTypes.STRING
  });

  Habit.associate = models => {
    Habit.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Habit;
};
