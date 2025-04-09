import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Habit } from "./habit.entity";
import { HabitScheduleType } from "../utils/habit_enums";

@Entity()
export class HabitSchedule {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Habit, (habit) => habit.habitSchedule, { onDelete: 'CASCADE' })
    @JoinColumn()
    habit: Habit;

    @Column({ type: 'enum', enum: HabitScheduleType })
    type: HabitScheduleType;

    @Column({ type: 'simple-array', nullable: true })
    daysOfWeek: number[]; // [1, 3, 5] = Mon, Wed, Fri

    @Column({ type: 'simple-array', nullable: true })
    daysOfMonth: number[]; // e.g. [1, 15, 30]

    @Column({ type: 'int', nullable: true })
    intervalDays: number;
}
