export default (sequelize, DataTypes) => {
    const HabitCompletion = sequelize.define('HabitCompletion', {
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        habitId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    HabitCompletion.associate = (models) => {
        HabitCompletion.belongsTo(models.Habit, {
            foreignKey: 'habitId',
            as: 'habit',
        });
        HabitCompletion.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
    };

    return HabitCompletion;
};
