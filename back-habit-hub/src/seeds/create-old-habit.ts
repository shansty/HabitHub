import { AppDataSource } from '../../data-source'
import { Habit } from '../habit_module/habit/entities/habit.entity'
import { HabitOccurrence } from '../habit_module/habit_occurrence/entities/habit_occurrence.entity'
import { HabitEvent } from '../habit_module/habit_event/entities/habit_event.entity'
import { User } from '../user_module/users/entities/users.entity'
import { subDays, addDays } from 'date-fns'
import {
    HabitDomain,
    HabitStatus,
    GoalPeriodicity,
    UnitOfMeasurement,
    Schedule,
} from '../habit_module/habit_enums'
import { HabitSchedule } from '../habit_module/habit_schedule/entities/habit_schedule.entity'

async function seed() {
    await AppDataSource.initialize()

    const userRepo = AppDataSource.getRepository(User)
    const habitRepo = AppDataSource.getRepository(Habit)
    const occurrenceRepo = AppDataSource.getRepository(HabitOccurrence)
    const eventRepo = AppDataSource.getRepository(HabitEvent)
    const scheduleRepo = AppDataSource.getRepository(HabitSchedule)

    const today = new Date()
    const startDate = subDays(today, 21)
    const totalDays = 21
    const completedCount = 21

    const user = await userRepo.findOne({
        where: {
            email: 'shirochina16@gmail.com',
        },
    })

    if (!user) {
        throw new Error('User not found')
    }

    const habit = habitRepo.create({
        name: 'Make Abandoned',
        goal: 5,
        goalDuration: 30,
        unit: UnitOfMeasurement.KM,
        goalPeriodicity: GoalPeriodicity.PER_DAY,
        category: HabitDomain.FITNESS,
        icon: '🏃‍♀️',
        startDate,
        status: HabitStatus.IN_PROGRESS,
        progress: 67,
        user,
        attempt: 1,
        attemptStartDate: startDate,
    })
    await habitRepo.save(habit)

    const schedule = scheduleRepo.create({
        habit: habit,
        type: Schedule.DAILY,
        daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
        daysOfMonth: [],
    })
    await scheduleRepo.save(schedule)

    for (let i = 0; i < habit.goalDuration; i++) {
        const date = addDays(startDate, i)
        const occurrence = occurrenceRepo.create({
            date,
            user,
            habit,
            habitId: habit.id,
            habitAttempt: habit.attempt,
        })
        await occurrenceRepo.save(occurrence)
    }

    for (let i = 0; i < totalDays; i++) {
        const date = addDays(startDate, i)
        const isCompleted = i < completedCount

        const event = eventRepo.create({
            habit,
            habitId: habit.id,
            date,
            value: isCompleted ? habit.goal : 0,
            isGoalCompleted: isCompleted,
            isFailure: false,
            habitAttempt: habit.attempt,
        })
        await eventRepo.save(event)
    }

    console.log('Seed completed!')
    process.exit()
}

seed().catch((err) => {
    console.error(' Seeding error:', err)
    process.exit(1)
})
