import { AppDataSource } from '../../data-source';
import { Habit } from '../habit_module/habit/entities/habit.entity';
import { HabitOccurrence } from '../habit_module/habit_occurrence/entities/habit_occurrence.entity';
import { HabitEvent } from '../habit_module/habit_event/entities/habit_event.entity';
import { User } from '../user_module/users/entities/users.entity';
import { subDays } from 'date-fns';
import { HabitDomain, HabitStatus, GoalPeriodicity, UnitOfMeasurement } from '../habit_module/habit_enums';

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const habitRepo = AppDataSource.getRepository(Habit);
  const occurrenceRepo = AppDataSource.getRepository(HabitOccurrence);
  const eventRepo = AppDataSource.getRepository(HabitEvent);

  const yesterday = subDays(new Date(), 1);

 
  const user = userRepo.create({
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'test123',
  });
  await userRepo.save(user);


  const habit = habitRepo.create({
    name: 'Run every morning',
    goal: 5,
    goalDuration: 30,
    unit: UnitOfMeasurement.KM,
    goalPeriodicity: GoalPeriodicity.PER_DAY,
    category: HabitDomain.FITNESS,
    icon: '🏃‍♀️',
    startDate: new Date('2024-04-01'),
    status: HabitStatus.IN_PROGRESS,
    user,
  });
  await habitRepo.save(habit);


  const occurrence = occurrenceRepo.create({
    date: yesterday,
    user,
    habit,
    habitId: habit.id,
  });
  await occurrenceRepo.save(occurrence);

 
  const event = eventRepo.create({
    habit,
    habitId: habit.id,
    date: yesterday,
    value: 0,
    isGoalCompleted: false,
    isFailure: false,
  });
  await eventRepo.save(event);

  console.log('Seed completed!');
  process.exit();
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
