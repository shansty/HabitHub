import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { HabitDto } from './dto/habit.dto'
import { Habit } from './entities/habit.entity'
import { InjectRepository } from '@nestjs/typeorm'
import {
    Repository,
    In,
    LessThan,
    MoreThan,
    MoreThanOrEqual,
    Not,
} from 'typeorm'
import { HabitCategoryConfig } from '../habit_unit_map'
import { HabitOccurrence } from '../habit_occurrence/entities/habit_occurrence.entity'
import { HabitEvent } from '../habit_event/entities/habit_event.entity'
import { HabitEventService } from '../habit_event/habit_event.service'
import { HabitScheduleService } from '../habit_schedule/habit_schedule.service'
import { HabitOccurrenceService } from '../habit_occurrence/habit_occurrence.service'
import {
    HabitPreviewResponseDto,
    HabitDetailedResponseDto,
    HabitDailyDataResponse,
} from './dto/response_habit.dto'
import { HabitStatus } from '../habit_enums'
import { addDays, format, startOfDay } from 'date-fns'
import { NotificationService } from '../../notification/notification.service'
import { FriendshipService } from '../../friendship/friendship.service'

@Injectable()
export class HabitService {
    private readonly logger = new Logger(HabitService.name, { timestamp: true })
    constructor(
        @InjectRepository(Habit)
        private readonly habitRepository: Repository<Habit>,
        @InjectRepository(HabitOccurrence)
        private readonly habitOccurrenceRepository: Repository<HabitOccurrence>,
        private readonly habitEventService: HabitEventService,
        private readonly habitScheduleService: HabitScheduleService,
        private readonly habitOccurrenceService: HabitOccurrenceService,
        private readonly notificationService: NotificationService,
        private readonly friendshipService: FriendshipService
    ) { }

    getHabitCategories() {
        return Object.entries(HabitCategoryConfig).map(([name, config]) => ({
            name,
            icons: config.icons,
            defaultIcon: config.defaultIcon,
            defaultUnit: config.defaultUnit,
            allowedUnits: config.allowedUnits,
        }))
    }

    async createHabit(body: HabitDto, userId: string) {
        const habit = await this.createAndSaveHabit(body, userId)

        await this.habitScheduleService.createSchedule(
            habit,
            body.habitSchedule,
            body.habitScheduleData
        )
        const occurrences = this.habitOccurrenceService.generateOccurrences(
            habit,
            userId,
            body.habitSchedule,
            body.habitScheduleData
        )
        await this.habitOccurrenceRepository.save(occurrences)
        return {
            success: true,
            habitId: habit.id,
        }
    }

    async getUserHabitsByDate(
        userId: string,
        date: string
    ): Promise<HabitPreviewResponseDto[]> {
        const dateObj = new Date(date)
        const userHabitOccurrences = await this.habitOccurrenceRepository.find({
            where: {
                user: { id: +userId },
                date: dateObj,
            },
            relations: ['user', 'habit'],
        })
        const habitIds = userHabitOccurrences.map(
            (occurrence) => occurrence.habitId
        )
        if (!habitIds.length) return []
        const habits = await this.habitRepository.find({
            where: { id: In(habitIds) },
            relations: ['events', 'habitSchedule'],
        })
        const isToday = this.habitEventService.isSameDay(dateObj, new Date())
        const eventMap = isToday
            ? await this.habitEventService.fetchOrCreateHabitEvents(
                habits,
                dateObj
            )
            : this.habitEventService.getExistingEventsForDate(habits, dateObj)

        return habits.map((habit) => {
            const event = eventMap.get(habit.id)
            return this.buildHabitPreviewResponse(habit, event)
        })
    }

    async deleteHabit(
        habitId: number,
        userId: number
    ): Promise<{ success: boolean }> {
        const habit = await this.habitRepository.findOne({
            where: { id: habitId, user: { id: userId } },
        })
        if (!habit) {
            throw new NotFoundException(
                'Habit not found or does not belong to the user'
            )
        }
        await this.habitRepository.remove(habit)
        return { success: true }
    }

    async editHabit(habitId: number, userId: string, habitData: HabitDto) {
        const habit = await this.habitRepository.findOne({
            where: { id: habitId, user: { id: +userId } },
            relations: ['habitSchedule'],
        })

        if (!habit)
            throw new NotFoundException('Habit not found or access denied.')

        this.updateHabitFieldsByHabitData(habit, habitData)

        await this.habitRepository.save(habit)

        await this.habitScheduleService.updateSchedule(
            habit.habitSchedule,
            habitData.habitSchedule,
            habitData.habitScheduleData
        )

        await this.habitOccurrenceRepository.delete({
            habit: { id: habit.id },
            habitAttempt: habit.attempt,
        })

        const newOccurrences = this.habitOccurrenceService.generateOccurrences(
            habit,
            userId,
            habitData.habitSchedule,
            habitData.habitScheduleData
        )
        await this.habitOccurrenceRepository.save(newOccurrences)

        return habit
    }

    async createAndSaveHabit(body: HabitDto, userId: string): Promise<Habit> {
        const habit = this.habitRepository.create({
            name: body.name,
            goal: body.goal,
            goalDuration: body.goalDuration,
            unit: body.unit,
            icon: body.icon,
            goalPeriodicity: body.goalPeriodicity,
            startDate: body.startDate,
            attemptStartDate: body.startDate,
            category: body.category,
            user: { id: +userId },
        })

        const savedHabit = await this.habitRepository.save(habit)
        return savedHabit
    }

    async getHabitByIdAndUserId(
        habitId: number,
        userId: number
    ): Promise<HabitDetailedResponseDto> {
        const habit = await this.habitRepository.findOne({
            where: {
                id: habitId,
                user: { id: userId },
            },
            relations: ['habitSchedule', 'events', 'habitOccurrence'],
        })

        if (!habit) {
            throw new NotFoundException('Error getting habit data')
        }
        const response = this.buildHabitDetailedResponse(habit)
        return response
    }

    async getHabitById(habitId: number): Promise<Habit> {
        const habit = await this.habitRepository.findOne({
            where: {
                id: habitId,
            },
            relations: ['habitSchedule', 'events', 'habitOccurrence', 'user'],
        })
        if (!habit) {
            throw new NotFoundException('Error getting habit data')
        }
        return habit
    }

    async countHabitProgressWithFine(
        habit: Habit
    ): Promise<{ updated_progress: number; progress_without_fine: number }> {
        const scheduledDays =
            await this.habitOccurrenceService.getHabitOccurrencesByHabit(habit)
        const totalScheduledDays = scheduledDays.length ?? 0
        const allEvents =
            await this.habitEventService.findAllEventsByHabitIdAndAttempt(
                habit.id,
                habit.attempt
            )
        const totalLoggedValue = allEvents.reduce((sum, e) => {
            const value = Math.min(e.value, habit.goal)
            return sum + value
        }, 0)
        const totalGoal = habit.goal * totalScheduledDays
        let progress =
            totalGoal > 0
                ? Math.min((totalLoggedValue / totalGoal) * 100, 100)
                : 0
        if (progress == 100) {
            habit.isCompleted = true
            habit.status = HabitStatus.COMPLETED
            const friendIds = await this.friendshipService.getFriendIdsForUser(habit.user.id)
            await this.notificationService.notifyHabitCompleted(habit, habit.user.id, friendIds)

        }
        const progress_without_fine = progress
        const failedDays = this.getNumberOfFailedDays(
            habit.events,
            habit.attempt
        )
        const newFailures = failedDays - (habit.penalizedFailedDays ?? 0);
        if (newFailures > 0) {
            if (failedDays === 1) {
                progress = Math.max(progress - 20, 0);
            } else if (failedDays === 2) {
                progress = Math.max(progress - 50, 0);
            } else if (failedDays > 2) {
                progress = 0;
                habit.status = HabitStatus.ABANDONED;
                habit.isFailed = true;
                await this.handleAbandonedHabit(habit);
            }
            habit.penalizedFailedDays = failedDays;
        }
        habit.progress = Math.round(progress)
        const updated_progress = habit.progress
        await this.habitRepository.save(habit)
        return { updated_progress, progress_without_fine }
    }


    async handleAbandonedHabit(habit: Habit) {
        const tomorrow = startOfDay(new Date())
        await this.habitOccurrenceRepository.delete({
            date: MoreThanOrEqual(tomorrow),
            habitId: habit.id,
            habitAttempt: habit.attempt,
        })
        this.logger.log(
            `Deleted future habit occurrences from ${format(tomorrow, 'yyyy-MM-dd')} onward for habit ID ${habit.id}`
        )
    }

    
    async startNewHabitAttempt(habitId: number, date: string, userId: string) {
        const startDate = new Date(date)
        const habit = await this.habitRepository.findOne({
            where: {
                id: habitId,
                user: { id: +userId },
            },
            relations: ['habitSchedule'],
        })
        if (!habit) {
            throw new NotFoundException('Habit data  not found')
        }
        habit.attempt = ++habit.attempt
        habit.status = HabitStatus.IN_PROGRESS
        habit.isFailed = false
        habit.attemptStartDate = new Date(date)
        await this.habitRepository.save(habit)
        const occurrences =
            this.habitOccurrenceService.generateOccurrencesForNewAttempt(
                habit,
                userId,
                startDate
            )
        await this.habitOccurrenceRepository.save(occurrences)
        return { success: true }
    }

    private buildHabitPreviewResponse(
        habit: Habit,
        event?: HabitEvent
    ): HabitPreviewResponseDto {
        return {
            id: habit.id,
            name: habit.name,
            goal: habit.goal,
            unit: habit.unit,
            icon: habit.icon,
            value: event?.value ?? 0,
            category: habit.category,
            progress: habit.progress,
            isGoalCompleted: event?.isGoalCompleted ?? false,
            isFailure: event?.isFailure ?? false,
            habitSchedule: {
                type: habit.habitSchedule?.type ?? null,
                daysOfWeek: habit.habitSchedule?.daysOfWeek ?? [],
                daysOfMonth: habit.habitSchedule?.daysOfMonth ?? [],
            },
        }
    }

    private buildHabitDetailedResponse(habit: Habit): HabitDetailedResponseDto {
        const currentAttempt = habit.attempt

        const currentEvents = habit.events.filter(
            (e) => e.habitAttempt === currentAttempt
        )
        const currentOccurrences = habit.habitOccurrence.filter(
            (o) => o.habitAttempt === currentAttempt
        )

        const totalValueQuantity = this.getTotalValue(currentEvents)
        const totalNumberOfCompletedDays = this.getCompletedDays(currentEvents)
        const habitDailyData = this.getHabitDailyData(
            currentEvents,
            currentOccurrences
        )
        const numberOfFailedDays = this.getNumberOfFailedDays(
            currentEvents,
            currentAttempt
        )

        return {
            id: habit.id,
            name: habit.name,
            goal: habit.goal,
            unit: habit.unit,
            icon: habit.icon,
            category: habit.category,
            startDate: habit.startDate,
            goalDuration: habit.goalDuration,
            goalPeriodicity: habit.goalPeriodicity,
            status: habit.status,
            progress: habit.progress,
            totalValueQuantity: totalValueQuantity,
            totalNumberOfCompletedDays: totalNumberOfCompletedDays,
            habitSchedule: {
                type: habit.habitSchedule?.type ?? null,
                daysOfWeek: habit.habitSchedule?.daysOfWeek ?? [],
                daysOfMonth: habit.habitSchedule?.daysOfMonth ?? [],
            },
            habitDailyData: habitDailyData,
            numberOfFailedDays: numberOfFailedDays,
            attemp: habit.attempt,
            attemptStartDate: habit.attemptStartDate,
        }
    }

    private getTotalValue(events: HabitEvent[]): number {
        return events.reduce((sum, e) => sum + (e.value || 0), 0)
    }

    private getCompletedDays(events: HabitEvent[]): number {
        return events.filter((e) => e.isGoalCompleted).length
    }

    private getNumberOfFailedDays(
        events: HabitEvent[],
        currentAttempt: number
    ): number {
        return events.filter(
            (e) => e.isFailure && e.habitAttempt === currentAttempt
        ).length
    }
    private getHabitDailyData(
        events: HabitEvent[],
        occurrences: HabitOccurrence[]
    ): HabitDailyDataResponse[] {
        const eventMap = new Map<
            string,
            { isGoalCompleted: boolean; value: number }
        >()

        events.map((event) => {
            const key = new Date(event.date).toISOString().split('T')[0]
            eventMap.set(key, {
                isGoalCompleted: event.isGoalCompleted,
                value: event.value,
            })
        })

        return occurrences.map((occurrence) => {
            const dateKey = new Date(occurrence.date)
                .toISOString()
                .split('T')[0]
            const eventData = eventMap.get(dateKey)
            return {
                date: occurrence.date,
                isGoalCompleted: eventData?.isGoalCompleted ?? false,
                value: eventData?.value ?? 0,
            }
        })
    }

    private updateHabitFieldsByHabitData(habit: Habit, habitData: HabitDto) {
        const fieldsToUpdate: (keyof HabitDto)[] = [
            'name',
            'goal',
            'goalDuration',
            'unit',
            'icon',
            'goalPeriodicity',
            'startDate',
            'category',
        ]

        for (const key of fieldsToUpdate) {
            const newValue =
                key === 'startDate'
                    ? new Date(habitData.startDate)
                    : habitData[key]

            if (habit[key] !== newValue) {
                habit[key] = newValue as any
            }
        }
    }
}
