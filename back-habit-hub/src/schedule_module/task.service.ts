import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HabitEventService } from '../habit_module/habit_event/habit_event.service';
import { subDays, format } from 'date-fns';
import { HabitOccurrenceService } from '../habit_module/habit_occurrence/habit_occurrence.service';
import { HabitEvent } from '../habit_module/habit_event/entities/habit_event.entity';


@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name, { timestamp: true });
  constructor(
    private readonly habitEventService: HabitEventService,
    private readonly habitOccurrenceService: HabitOccurrenceService
  ) { }


  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkIsYesterdayHabitEventFailed() {
    const yesterday = subDays(new Date(), 1);
    const formattedDate = format(yesterday, 'yyyy-MM-dd');
    this.logger.log(`Scheduled job started: checking for failed habits on ${formattedDate}`);
    try {
      const occurrences = await this.habitOccurrenceService.getByDate(yesterday);
      if (occurrences.length === 0) {
        this.logger.log(`No occurrences found for ${format(yesterday, 'yyyy-MM-dd')}`);
        return;
      }
      const { eventsToUpdate, eventsToCreate } = await this.getFailedAndMissingHabitEvents(occurrences, yesterday);
      this.logger.log(`Found ${eventsToUpdate.length} events to update and ${eventsToCreate.length} to create.`);
      await this.saveFailedHabitEvents(eventsToUpdate, eventsToCreate);
      this.logger.log(`Finished checking failed habits for ${formattedDate}`);
    } catch (error) {
      this.logger.error('Error during habit failure check:', error);
    }
  }


  private async getFailedAndMissingHabitEvents(occurrences: { habitId: number }[], date: Date,): Promise<{ eventsToUpdate: HabitEvent[]; eventsToCreate: Partial<HabitEvent>[] }> {
    const habitIds = occurrences.map(o => o.habitId);
    const existingEvents = await this.habitEventService.findEventByHabitIdAndDate(habitIds, date);
    const eventMap = new Map<number, HabitEvent>();
    existingEvents.map(event => eventMap.set(event.habitId, event));
    const eventsToUpdate: HabitEvent[] = [];
    const eventsToCreate: Partial<HabitEvent>[] = [];
    for (const { habitId } of occurrences) {
      const event = eventMap.get(habitId);
      if (event && !event.isGoalCompleted && !event.isFailure) {
        event.isFailure = true;
        eventsToUpdate.push(event);
      }
      if (!event) {
        eventsToCreate.push(this.buildFailedEvent(habitId, date));
      }
    }
    return { eventsToUpdate, eventsToCreate };
  }


  private buildFailedEvent(habitId: number, date: Date): Partial<HabitEvent> {
    return {
      habitId,
      date,
      value: 0,
      isGoalCompleted: false,
      isFailure: true,
    };
  }


  private async saveFailedHabitEvents(eventsToUpdate: HabitEvent[], eventsToCreate: Partial<HabitEvent>[]) {
    if (eventsToUpdate.length > 0) {
      const updatedIds = eventsToUpdate.map(event => event.id).join(', ');
      this.logger.log(`Updating habit events with IDs: [${updatedIds}]`);
      await this.habitEventService.saveMany(eventsToUpdate);
    }

    if (eventsToCreate.length > 0) {
      const createdIds = eventsToCreate.map(event => event.id).join(', ');
      this.logger.log(`Creating failed habit events for IDs: [${createdIds}]`);
      await this.habitEventService.createMany(eventsToCreate);
    }
  }
}
