import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TasksService } from './task.service'
import { HabitEventModule } from '../habit_module/habit_event/habit_event.module'
import { HabitOccurrenceModule } from '../habit_module/habit_occurrence/habit_occurrence.module'
import { HabitModule } from '../habit_module/habit/habit.module'

@Module({
    imports: [
        ScheduleModule.forRoot(),
        HabitEventModule,
        HabitOccurrenceModule,
        HabitModule,
    ],
    providers: [TasksService],
})
export class TaskModule {}
