import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HabitService } from './habit.service';
import { Habit } from './entities/habit.entity';
import { HabitOccurrence } from '../habit_occurrence/entities/habit_occurrence.entity';
import { NotificationService } from '../../notification/notification.service';
import { HabitScheduleService } from '../habit_schedule/habit_schedule.service';
import { HabitOccurrenceService } from '../habit_occurrence/habit_occurrence.service';
import { FriendshipService } from '../../friendship/friendship.service';
import { HabitEventService } from '../habit_event/habit_event.service';
import {
    mockHabit,
    mockEvent,
    mockHabitWithoutEvent,
} from './__mocks__/habit.mock';
import { Schedule } from '../../habit_module/habit_enums'; 

describe('HabitService', () => {
    let service: HabitService;

    const mockHabitRepository = {};
    const mockHabitOccurrenceRepository = {};
    const mockNotificationService = {};
    const mockFriendshipService = {};
    const mockHabitOccurrenceService = {};
    const mockHabitScheduleService = {};
    const mockHabitEventService = {};

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HabitService,
                {
                    provide: getRepositoryToken(Habit),
                    useValue: mockHabitRepository,
                },
                {
                    provide: getRepositoryToken(HabitOccurrence),
                    useValue: mockHabitOccurrenceRepository,
                },
                {
                    provide: NotificationService,
                    useValue: mockNotificationService,
                },
                {
                    provide: HabitScheduleService,
                    useValue: mockHabitScheduleService,
                },
                {
                    provide: HabitOccurrenceService,
                    useValue: mockHabitOccurrenceService,
                },
                {
                    provide: FriendshipService,
                    useValue: mockFriendshipService,
                },
                {
                    provide: HabitEventService,
                    useValue: mockHabitEventService,
                },
            ],
        }).compile();

        service = module.get<HabitService>(HabitService);
    });

    describe('buildHabitPreviewResponse', () => {
        it('should build response with event', () => {
            const result = (service as any).buildHabitPreviewResponse(mockHabit, mockEvent);

            expect(result).toMatchObject({
                id: 1,
                name: 'Drink Water',
                value: 5,
                isGoalCompleted: true,
                isFailure: false,
                habitSchedule: {
                    type: Schedule.DAILY, 
                    daysOfWeek: [1, 3, 5],
                    daysOfMonth: [],
                },
            });
        });

        it('should build response without event', () => {
            const result = (service as any).buildHabitPreviewResponse(mockHabitWithoutEvent);

            expect(result).toMatchObject({
                id: 2,
                name: 'Walk',
                value: 0,
                isGoalCompleted: false,
                isFailure: false,
                habitSchedule: {
                    type: Schedule.DAILY,
                    daysOfWeek: [1, 3, 5],
                    daysOfMonth: [],
                },
            });
        });
    });
});
