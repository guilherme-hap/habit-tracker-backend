import { parseISO, differenceInDays } from 'date-fns';
import { Op } from 'sequelize';

function getExpectedOccurrences(frequency, start, end) {
    if (!start || !end) return 0;

    const days = differenceInDays(parseISO(end), parseISO(start)) + 1;

    switch (frequency) {
        case 'daily':
            return days;
        case 'weekly':
            return Math.ceil(days / 7);
        case 'monthly':
            return Math.ceil(days / 30);
        default:
            return days;
    }
}

export default class StatsService {
    constructor(models) {
        this.models = models;
    }

    async getUserStats(userId, filters = {}) {
        const { tags, frequency, startDate, endDate } = filters;
        const whereHabit = { userId };

        if (frequency) {
            whereHabit.frequency = frequency;
        }

        const include = [];

        if (tags) {
            const tagList = tags.split(',').map((t) => t.trim());

            include.push({
                model: this.models.Tag,
                as: 'tags',
                where: {
                    [Op.or]: tagList.map((tag) => ({
                        name: { [Op.like]: `%${tag}%` },
                    })),
                },
                required: true,
                through: { attributes: [] },
            });
        }

        const habits = await this.models.Habit.findAll({
            where: whereHabit,
            include,
        });

        const stats = [];

        for (const habit of habits) {
            const completionWhere = {
                userId,
                habitId: habit.id,
            };

            if (startDate && endDate) {
                completionWhere.date = {
                    [Op.between]: [startDate, endDate],
                };
            }

            const completions = await this.models.HabitCompletion.findAll({
                where: completionWhere,
            });

            const expected = getExpectedOccurrences(habit.frequency, startDate, endDate);
            const positive = completions.length;
            const negative = Math.max(0, expected - positive);

            stats.push({
                title: habit.name,
                frequency: habit.frequency,
                expected,
                positive,
                negative,
            });
        }

        return stats;
    }

    _calculateHabitStats(habit) {
        const completions = habit.HabitCompletions || [];
        const completed = completions.filter((c) => c.status === 'completed').length;
        const totalDays = this._countDaysInRange(completions);

        return {
            habitId: habit.id,
            name: habit.name,
            completionRate: totalDays > 0 ? completed / totalDays : 0,
            currentStreak: this._calculateCurrentStreak(completions),
            longestStreak: this._calculateLongestStreak(completions),
        };
    }

    _calculateSummary(habitsStats) {
        const totalCompleted = habitsStats.reduce(
            (sum, habit) => sum + habit.completionRate * 100,
            0,
        );
        const avgCompletion = habitsStats.length > 0 ? totalCompleted / habitsStats.length : 0;

        return {
            totalHabits: habitsStats.length,
            averageCompletion: avgCompletion,
        };
    }

    _calculateCurrentStreak(completions) {
        return 0;
    }

    _calculateLongestStreak(completions) {
        return 0;
    }

    _getDateRange(period) {
        const now = new Date();
        const start = new Date(now);

        switch (period) {
            case 'week':
                start.setDate(now.getDate() - 7);
                break;
            case 'month':
                start.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                start.setFullYear(now.getFullYear() - 1);
                break;
            default:
                start.setTime(0);
        }

        return { start, end: now };
    }

    _countDaysInRange(completions) {
        if (completions.length === 0) return 0;
        const dates = completions.map((c) => new Date(c.date).getTime());
        const minDate = Math.min(...dates);
        const maxDate = Math.max(...dates);
        return Math.ceil((maxDate - minDate) / 86400000) + 1;
    }
}
