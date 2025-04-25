import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { HabitSchedule } from './entities/habit_schedule.entity'
import { Habit } from '../habit/entities/habit.entity'
import { Schedule } from '../habit_enums'
import { Injectable } from '@nestjs/common'

@Injectable()
export class HabitScheduleService {
    constructor(
        @InjectRepository(HabitSchedule)
        private readonly habitScheduleRepository: Repository<HabitSchedule>
    ) {}

    async createSchedule(
        habit: Habit,
        scheduleType: Schedule,
        scheduleData: { daysOfWeek?: number[]; daysOfMonth?: number[] }
    ): Promise<HabitSchedule> {
        const schedule = this.habitScheduleRepository.create({
            habit,
            type: scheduleType,
            daysOfWeek:
                scheduleType === Schedule.DAILY ? scheduleData.daysOfWeek : [],
            daysOfMonth:
                scheduleType === Schedule.MONTHLY
                    ? scheduleData.daysOfMonth
                    : [],
        })

        const savedSchedule = await this.habitScheduleRepository.save(schedule)
        return savedSchedule
    }

    async updateSchedule(
        schedule: HabitSchedule,
        type: Schedule,
        newData: { daysOfWeek?: number[]; daysOfMonth?: number[] }
    ): Promise<HabitSchedule> {
        schedule.type = type
        schedule.daysOfWeek =
            type === Schedule.DAILY ? (newData.daysOfWeek ?? []) : []
        schedule.daysOfMonth =
            type === Schedule.MONTHLY ? (newData.daysOfMonth ?? []) : []

        const updatedSchedule =
            await this.habitScheduleRepository.save(schedule)
        return updatedSchedule
    }
}
