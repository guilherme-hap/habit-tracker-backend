export default class StatsService {
    constructor(models) {
      this.models = models;
    }
  
    async getUserStats(userId, period = 'month') {
      const dateRange = this._getDateRange(period);
  
      const habits = await this.models.Habit.findAll({
        where: { userId },
        include: [{
          model: this.models.HabitCompletion,
          where: {
            date: { [Op.between]: [dateRange.start, dateRange.end] }
          },
          required: false
        }]
      });
  
      const stats = {
        period: period,
        startDate: dateRange.start,
        endDate: dateRange.end,
        habits: []
      };
  
      for (const habit of habits) {
        stats.habits.push(this._calculateHabitStats(habit));
      }
  
      stats.summary = this._calculateSummary(stats.habits);
  
      return stats;
    }
  
    _calculateHabitStats(habit) {
      const completions = habit.HabitCompletions || [];
      const completed = completions.filter(c => c.status === 'completed').length;
      const totalDays = this._countDaysInRange(completions);
  
      return {
        habitId: habit.id,
        name: habit.name,
        completionRate: totalDays > 0 ? (completed / totalDays) : 0,
        currentStreak: this._calculateCurrentStreak(completions),
        longestStreak: this._calculateLongestStreak(completions)
      };
    }
  
    _calculateSummary(habitsStats) {
      const totalCompleted = habitsStats.reduce((sum, habit) => sum + (habit.completionRate * 100), 0);
      const avgCompletion = habitsStats.length > 0 ? (totalCompleted / habitsStats.length) : 0;
  
      return {
        totalHabits: habitsStats.length,
        averageCompletion: avgCompletion
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
      const dates = completions.map(c => new Date(c.date).getTime());
      const minDate = Math.min(...dates);
      const maxDate = Math.max(...dates);
      return Math.ceil((maxDate - minDate) / 86400000) + 1;
    }
  }
  