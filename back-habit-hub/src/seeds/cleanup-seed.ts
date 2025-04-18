import { AppDataSource } from '../../data-source';
import { User } from '../user_module/users/entities/users.entity';
import { Habit } from '../habit_module/habit/entities/habit.entity';
import { HabitOccurrence } from '../habit_module/habit_occurrence/entities/habit_occurrence.entity';
import { HabitEvent } from '../habit_module/habit_event/entities/habit_event.entity';
import { In } from 'typeorm';

async function cleanup() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const habitRepo = AppDataSource.getRepository(Habit);
  const occurrenceRepo = AppDataSource.getRepository(HabitOccurrence);
  const eventRepo = AppDataSource.getRepository(HabitEvent);

  const user = await userRepo.findOne({
    where: { email: 'testuser@example.com' },
    relations: ['habits'],
  });

  if (!user) {
    console.log('No test user found to delete.');
    process.exit(0);
  }

  const habits = await habitRepo.find({
    where: { user: { id: user.id } },
  });

  const habitIds = habits.map(h => h.id);

  if (habitIds.length > 0) {
    await eventRepo.delete({ habitId: In(habitIds) });
    await occurrenceRepo.delete({ habitId: In(habitIds) });
    await habitRepo.delete({ id: In(habitIds) });
  }

  await userRepo.delete({ id: user.id });

  console.log('Cleanup complete!');
  process.exit(0);
}

cleanup().catch((err) => {
  console.error('Cleanup failed', err);
  process.exit(1);
});
