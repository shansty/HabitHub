import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { HabitEvent } from './entities/habit_event.entity'
import { Habit } from '../habit/entities/habit.entity'
import { HabitService } from '../habit/habit.service'
import { NotificationService } from '../../notification/notification.service'
import { FriendshipService } from '../../friendship/friendship.service'

@Injectable()
export class HabitEventService {
    constructor(
        @InjectRepository(HabitEvent)
        private habitEventRepository: Repository<HabitEvent>,
        @Inject(forwardRef(() => HabitService))
        private readonly habitService: HabitService,
        private readonly notificationService: NotificationService,
        private readonly friendshipService: FriendshipService
    ) { }

    
    async addEventValue(habitId: number, logValue: number, date: string) {
        if (logValue < 0) {
            throw new BadRequestException('Negative numbers are not available.')
        }
        const habit = await this.habitService.getHabitById(habitId)
        const habit_event = await this.habitEventRepository.findOne({
            where: {
                habitId: habitId,
                date: new Date(date),
                habitAttempt: habit.attempt,
            },
            relations: ['habit', 'habit.events', 'habit.habitOccurrence', 'habit.user'],
        })
        if (!habit_event) {
            throw new NotFoundException(
                'Error edding a progress value. Please reload the page.'
            )
        }
        habit_event.value += logValue
        const isCompleted = this.checkIsGoalCompleted(
            habit_event.habit.goal,
            habit_event.value
        )
        if (isCompleted) {
            habit_event.isGoalCompleted = true
            const friendsIds = await this.friendshipService.getFriendIdsForUser(habit.user.id)
            this.notificationService.notifyDailyGoalCompleted(habit, habit.user.id, friendsIds)
        }
        await this.habitEventRepository.save(habit_event)
        await this.habitService.countHabitProgressWithFine(habit_event.habit)

        return {
            success: true,
            isGoalCompleted: isCompleted,
        }
    }

    async fetchOrCreateHabitEvents(
        habits: Habit[],
        date: Date
    ): Promise<Map<number, HabitEvent>> {
        const eventMap = this.getExistingEventsForDate(habits, date)
        const missingEvents: HabitEvent[] = []
        for (const habit of habits) {
            if (!eventMap.has(habit.id)) {
                const newEvent = this.createDefaultHabitEvent(habit, date)
                missingEvents.push(newEvent)
                eventMap.set(habit.id, newEvent)
            }
        }
        if (missingEvents.length > 0) {
            await this.habitEventRepository.save(missingEvents)
        }
        return eventMap
    }

    getExistingEventsForDate(
        habits: Habit[],
        date: Date
    ): Map<number, HabitEvent> {
        const map = new Map<number, HabitEvent>()
        for (const habit of habits) {
            for (const event of habit.events) {
                const isSameDay = this.isSameDay(new Date(event.date), date)
                const isSameAttempt = event.habitAttempt === habit.attempt
                if (isSameDay && isSameAttempt) {
                    map.set(habit.id, event)
                    break
                }
            }
        }
        return map
    }

    createDefaultHabitEvent(habit: Habit, date: Date): HabitEvent {
        const newEvent = this.habitEventRepository.create({
            habit: habit,
            habitId: habit.id,
            date: date,
            value: 0,
            isGoalCompleted: false,
            isFailure: false,
            habitAttempt: habit.attempt,
        })
        return newEvent
    }

    isSameDay(d1: Date, d2: Date): boolean {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        )
    }

    checkIsGoalCompleted(goal: number, value: number): boolean {
        if (value >= goal) {
            return true
        } else {
            return false
        }
    }

    async findEventByHabitIdAndDate(
        habitIds: number[],
        date: Date
    ): Promise<HabitEvent[]> {
        return this.habitEventRepository.find({
            where: {
                habitId: In(habitIds),
                date,
            },
        })
    }

    async findAllEventsByHabitIdAndAttempt(
        habitId: number,
        attempt: number
    ): Promise<HabitEvent[]> {
        return this.habitEventRepository.find({
            where: {
                habitId: habitId,
                habitAttempt: attempt,
            },
        })
    }

    async createMany(events: Partial<HabitEvent>[]): Promise<void> {
        await this.habitEventRepository.insert(events)
    }

    async saveMany(events: HabitEvent[]): Promise<void> {
        await this.habitEventRepository.save(events)
    }
}
