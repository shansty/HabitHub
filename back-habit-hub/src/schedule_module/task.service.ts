import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { HabitEventService } from '../habit_module/habit_event/habit_event.service'
import { subDays, format } from 'date-fns'
import { HabitOccurrenceService } from '../habit_module/habit_occurrence/habit_occurrence.service'
import { HabitEvent } from '../habit_module/habit_event/entities/habit_event.entity'
import { HabitService } from '../habit_module/habit/habit.service'
import { Habit } from '../habit_module/habit/entities/habit.entity'
import { HabitStatus } from '../habit_module/habit_enums'

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name, { timestamp: true })
    constructor(
        private readonly habitEventService: HabitEventService,
        private readonly habitOccurrenceService: HabitOccurrenceService,
        private readonly habitService: HabitService
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    // @Cron('* * * * *')
    async checkIsYesterdayHabitEventFailed() {
        const yesterday = subDays(new Date(), 1)
        const formattedDate = format(yesterday, 'yyyy-MM-dd')
        this.logger.log(
            `Scheduled job started: checking for failed habits on ${formattedDate}`
        )
        try {
            const occurrences =
                await this.habitOccurrenceService.getByDate(yesterday)
            if (occurrences.length === 0) {
                this.logger.log(
                    `No occurrences found for ${format(yesterday, 'yyyy-MM-dd')}`
                )
                return
            }
            const { eventsToUpdate, eventsToCreate } =
                await this.getFailedAndMissingHabitEvents(
                    occurrences,
                    yesterday
                )
            this.logger.log(
                `Found ${eventsToUpdate.length} events to update and ${eventsToCreate.length} to create.`
            )
            await this.saveFailedHabitEvents(eventsToUpdate, eventsToCreate)
            await this.countHabitProgressAndCreateHabitOccurences(
                eventsToUpdate,
                eventsToCreate
            )
            this.logger.log(
                `Finished checking failed habits for ${formattedDate}`
            )
        } catch (error) {
            this.logger.error('Error during habit failure check:', error)
        }
    }

    private async getFailedAndMissingHabitEvents(
        occurrences: { habitId: number }[],
        date: Date
    ): Promise<{
        eventsToUpdate: HabitEvent[]
        eventsToCreate: Partial<HabitEvent>[]
    }> {
        const habitIds = occurrences.map((o) => o.habitId)
        const existingEvents =
            await this.habitEventService.findEventByHabitIdAndDate(
                habitIds,
                date
            )
        const existingMap = new Map(existingEvents.map((e) => [e.habitId, e]))
        const eventsToUpdate: HabitEvent[] = []
        const eventsToCreate: Partial<HabitEvent>[] = []
        for (const { habitId } of occurrences) {
            const event = existingMap.get(habitId)
            if (event && !event.isGoalCompleted && !event.isFailure) {
                event.isFailure = true
                eventsToUpdate.push(event)
            }
            if (!event) {
                eventsToCreate.push(this.buildFailedEvent(habitId, date))
            }
        }
        this.logger.log(`The updated progress count has begun`)
        return { eventsToUpdate, eventsToCreate }
    }

    private buildFailedEvent(habitId: number, date: Date): Partial<HabitEvent> {
        return {
            habitId,
            date,
            value: 0,
            isGoalCompleted: false,
            isFailure: true,
        }
    }

    private async saveFailedHabitEvents(
        eventsToUpdate: HabitEvent[],
        eventsToCreate: Partial<HabitEvent>[]
    ) {
        const updatedIds = eventsToUpdate.map((event) => event.id).join(', ')
        const createdIds = eventsToCreate.map((event) => event.id).join(', ')
        if (eventsToUpdate.length > 0) {
            this.logger.log(`Updating habit events with IDs: [${updatedIds}]`)
            await this.habitEventService.saveMany(eventsToUpdate)
        }
        if (eventsToCreate.length > 0) {
            this.logger.log(
                `Creating failed habit events for IDs: [${createdIds}]`
            )
            await this.habitEventService.createMany(eventsToCreate)
        }
    }

    private async countHabitProgressAndCreateHabitOccurences(
        eventsToUpdate: HabitEvent[],
        eventsToCreate: Partial<HabitEvent>[]
    ): Promise<void> {
        const affectedHabitIds = [
            ...new Set([
                ...eventsToUpdate.map((e) => e.habitId),
                ...eventsToCreate.map((e) => e.habitId),
            ]),
        ]

        for (const habitId of affectedHabitIds) {
            const habit = await this.habitService.getHabitById(
                habitId as number
            )
            const progress =
                await this.habitService.countHabitProgressWithFine(habit)
            this.logger.log(
                `Recounted progress for habit ID: ${habitId} with status ${habit.status} is ${progress.updated_progress}`
            )
            if (habit.status != HabitStatus.ABANDONED) {
                await this.createAdditionalHabitOccurrences(
                    habit,
                    progress.updated_progress,
                    progress.progress_without_fine
                )
            }
        }
    }

    async createAdditionalHabitOccurrences(
        habit: Habit,
        updated_progress: number,
        progress_without_fine: number
    ): Promise<void> {
        const lostProgress = progress_without_fine - updated_progress
        if (!lostProgress) return

        const newOccurrencesNeeded = Math.ceil(
            (lostProgress / 100) * habit.goalDuration
        )
        const lastDate =
            habit.habitOccurrence.reduce((latest, current) => {
                return new Date(current.date) > new Date(latest.date)
                    ? current
                    : latest
            }, habit.habitOccurrence[0])?.date ?? habit.startDate

        const startFrom = new Date(lastDate)
        startFrom.setDate(startFrom.getDate() + 1)
        const futureOccurrences =
            this.habitOccurrenceService.generateOccurrencesFromDate(
                habit,
                String(habit.user.id),
                habit.habitSchedule.type,
                {
                    daysOfWeek: habit.habitSchedule.daysOfWeek,
                    daysOfMonth: habit.habitSchedule.daysOfMonth,
                },
                startFrom,
                newOccurrencesNeeded
            )
        await this.habitOccurrenceService.saveMany(futureOccurrences)
        this.logger.log(
            `Added ${futureOccurrences.length} new occurrences for habit ID: ${habit.id} to recover lost progress`
        )
    }
}
