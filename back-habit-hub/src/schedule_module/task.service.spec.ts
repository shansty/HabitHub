import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './task.service';
import { HabitService } from '../habit_module/habit/habit.service';
import { HabitEventService } from '../habit_module/habit_event/habit_event.service';
import { HabitOccurrenceService } from '../habit_module/habit_occurrence/habit_occurrence.service';
import { HabitStatus, Schedule } from '../habit_module/habit_enums';


describe('CronJob', () => {
    let service: TasksService;
    let habitService: Partial<Record<keyof HabitService, jest.Mock>>;
    let habitEventService: Partial<Record<keyof HabitEventService, jest.Mock>>;
    let habitOccurrenceService: Partial<Record<keyof HabitOccurrenceService, jest.Mock>>;

    beforeEach(async () => {
        habitService = {
            getHabitById: jest.fn(),
            countHabitProgressWithFine: jest.fn(),
        };
        habitEventService = {
            findEventByHabitIdAndDate: jest.fn(),
            saveMany: jest.fn(),
            createMany: jest.fn(),
        };
        habitOccurrenceService = {
            getByDate: jest.fn(),
            generateOccurrencesFromDate: jest.fn(),
            saveMany: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: HabitService, useValue: habitService },
                { provide: HabitEventService, useValue: habitEventService },
                { provide: HabitOccurrenceService, useValue: habitOccurrenceService },
            ],
        }).compile();

        service = module.get<TasksService>(TasksService);
    });


    it('should create failed events and new occurrences when events are missing', async () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const occurrences = [{ habitId: 1 }];
        (habitOccurrenceService.getByDate as jest.Mock).mockResolvedValue(occurrences);

        (habitEventService.findEventByHabitIdAndDate as jest.Mock).mockResolvedValue([]);

        (habitService.getHabitById as jest.Mock).mockResolvedValue({
            id: 1,
            goalDuration: 30,
            status: HabitStatus.IN_PROGRESS,
            user: { id: 123 },
            habitOccurrence: [{ date: yesterday }],
            habitSchedule: {
                type: 'DAILY',
                daysOfWeek: [1, 3, 5],
                daysOfMonth: [],
            },
        });

        (habitService.countHabitProgressWithFine as jest.Mock).mockResolvedValue({
            updated_progress: 60,
            progress_without_fine: 80,
        });

        const generatedOccurrences = [{ date: new Date(), habitId: 1 }];
        (habitOccurrenceService.generateOccurrencesFromDate as jest.Mock).mockReturnValue(generatedOccurrences);

        (habitEventService.createMany as jest.Mock).mockResolvedValue([]);
        (habitOccurrenceService.saveMany as jest.Mock).mockResolvedValue([]);

        await service.checkIsYesterdayHabitEventFailed();

        expect(habitEventService.createMany).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    habitId: 1,
                    isFailure: true,
                    isGoalCompleted: false,
                    value: 0,
                }),
            ])
        );

        expect(habitService.countHabitProgressWithFine).toHaveBeenCalled();
        expect(habitOccurrenceService.saveMany).toHaveBeenCalledWith(generatedOccurrences);
    });

    it('should update existing habit events as failed if not completed', async () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const existingEvent = {
            habitId: 1,
            id: 101,
            isGoalCompleted: false,
            isFailure: false,
        };

        (habitOccurrenceService.getByDate as jest.Mock).mockResolvedValue([{ habitId: 1 }]);
        (habitEventService.findEventByHabitIdAndDate as jest.Mock).mockResolvedValue([existingEvent]);
        (habitEventService.saveMany as jest.Mock).mockResolvedValue([]);

        (habitService.getHabitById as jest.Mock).mockResolvedValue({
            id: 1,
            goalDuration: 30,
            status: HabitStatus.IN_PROGRESS,
            user: { id: 123 },
            habitOccurrence: [{ date: yesterday }],
            habitSchedule: {
                type: 'DAILY',
                daysOfWeek: [1, 3, 5],
                daysOfMonth: [],
            },
        });

        (habitService.countHabitProgressWithFine as jest.Mock).mockResolvedValue({
            updated_progress: 70,
            progress_without_fine: 90,
        });

        (habitOccurrenceService.generateOccurrencesFromDate as jest.Mock).mockReturnValue([{ habitId: 1, date: new Date() }]);
        (habitOccurrenceService.saveMany as jest.Mock).mockResolvedValue([]);

        await service.checkIsYesterdayHabitEventFailed();

        expect(habitEventService.saveMany).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({ habitId: 1, isFailure: true }),
            ])
        );
    });


    it('should not create new occurrences for abandoned habits', async () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        (habitOccurrenceService.getByDate as jest.Mock).mockResolvedValue([{ habitId: 1 }]);
        (habitEventService.findEventByHabitIdAndDate as jest.Mock).mockResolvedValue([]);
        (habitEventService.createMany as jest.Mock).mockResolvedValue([]);

        (habitService.getHabitById as jest.Mock).mockResolvedValue({
            id: 1,
            goalDuration: 30,
            status: HabitStatus.ABANDONED, 
            user: { id: 123 },
            habitOccurrence: [{ date: yesterday }],
            habitSchedule: {
                type: 'DAILY',
                daysOfWeek: [1, 3, 5],
                daysOfMonth: [],
            },
        });

        (habitService.countHabitProgressWithFine as jest.Mock).mockResolvedValue({
            updated_progress: 60,
            progress_without_fine: 80,
        });

        await service.checkIsYesterdayHabitEventFailed();

        expect(habitOccurrenceService.generateOccurrencesFromDate).not.toHaveBeenCalled();
        expect(habitOccurrenceService.saveMany).not.toHaveBeenCalled();
    });

});
