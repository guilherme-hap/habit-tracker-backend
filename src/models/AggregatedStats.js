module.exports = (sequelize, DataTypes) => {
    const AggregatedStats = sequelize.define('AggregatedStats', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        periodType: {
            type: DataTypes.ENUM('day', 'week', 'month', 'year'),
            allowNull: false,
        },
        periodStart: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        completionRate: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        currentStreak: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        longestStreak: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    });

    return AggregatedStats;
};
