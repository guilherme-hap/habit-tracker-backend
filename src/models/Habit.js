const Habit = (sequelize, DataTypes) => {
    const HabitModel = sequelize.define('Habit', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        frequency: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    HabitModel.associate = (models) => {
        HabitModel.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

        HabitModel.belongsToMany(models.Tag, {
            through: 'HabitTag',
            foreignKey: 'habitId',
            otherKey: 'tagId',
            as: 'tags',
        });

        HabitModel.hasMany(models.HabitCompletion, {
            foreignKey: 'habitId',
            as: 'completions',
        });
    };

    return HabitModel;
};

export default Habit;
