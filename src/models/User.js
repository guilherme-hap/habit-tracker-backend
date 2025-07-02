import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

export default (sequelize) => {
    const User = sequelize.define(
        'User',
        {
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            avatar: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            provider: {
                type: DataTypes.STRING,
                defaultValue: 'local',
            },
        },
        {
            hooks: {
                beforeCreate: async (user) => {
                    if (user.password) {
                        user.password = await bcrypt.hash(user.password, 10);
                    }
                },
            },
        },
    );

    User.associate = (models) => {
        User.hasMany(models.Habit, { foreignKey: 'userId' });
        User.hasMany(models.Tag, { foreignKey: 'userId' });
    };

    return User;
};
