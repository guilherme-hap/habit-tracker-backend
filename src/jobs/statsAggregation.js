import StatsService from '../services/statsService.js';

export default function(models) {
  const statsService = new StatsService(models);

  async function run() {
    try {
      console.log('Running stats aggregation...');
      const users = await models.User.findAll();
      
      for (const user of users) {
        const stats = await statsService.getUserStats(user.id, 'day');
        await models.AggregatedStats.create({
          userId: user.id,
          periodType: 'day',
          periodStart: new Date(),
          completionRate: stats.summary.averageCompletion,
          currentStreak: 0,
          longestStreak: 0
        });
      }
    } catch (error) {
      console.error('Stats aggregation error:', error);
    }
  }

  return run;
}