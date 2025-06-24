export default (sequelize, DataTypes) => {
    const Habit = sequelize.define('Habit', {
        name: DataTypes.STRING,
        frequency: DataTypes.STRING, 
        tags: {
            type: DataTypes.STRING,
            get() {
              const raw = this.getDataValue('tags');
              return raw ? raw.split(',') : [];
            },
            set(value) {
              this.setDataValue('tags', Array.isArray(value) ? value.join(',') : value);
            }
          },
        userId: DataTypes.INTEGER,
    });

    Habit.associate = (models) => {
        Habit.hasMany(models.HabitCompletion, { foreignKey: 'habitId', as: 'completions' });
    };

    return Habit;
};
