export default (sequelize, DataTypes) => {
    const Tag = sequelize.define('Tag', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    Tag.associate = (models) => {
        Tag.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

        Tag.belongsToMany(models.Habit, {
            through: 'HabitTag',
            foreignKey: 'tagId',
            otherKey: 'habitId',
            as: 'habits',
        });
    };

    return Tag;
};
