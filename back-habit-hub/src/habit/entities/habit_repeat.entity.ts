import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Habit } from "./habit.entity";

enum HabitRepeatType {
    DAILY = 'DAILY',
    MONTHLY = 'MONTHLY',
    INTERVAL = 'INTERVAL',
}

@Entity()
export class HabitRepeat {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Habit, (habit) => habit.habitRepeat, { onDelete: 'CASCADE' })
    @JoinColumn()
    habit: Habit;

    @Column({ type: 'enum', enum: HabitRepeatType })
    type: HabitRepeatType;

    // For DAILY — store an array of weekdays (7 = Sunday, 1 = Monday)
    @Column({ type: 'simple-array', nullable: true })
    daysOfWeek: number[]; // e.g. [1, 3, 5] → Mon, Wed, Fri

    // For MONTHLY — store the specific day(s) of the month
    @Column({ type: 'simple-array', nullable: true })
    daysOfMonth: number[]; // e.g. [1, 15, 30]

    // For INTERVAL — store how many days between repeats
    @Column({ type: 'int', nullable: true })
    intervalDays: number;
}
