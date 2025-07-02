export default (sequelize, DataTypes) => {
    const HabitTag = sequelize.define('HabitTag', {
        habitId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tagId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    return HabitTag;
};
