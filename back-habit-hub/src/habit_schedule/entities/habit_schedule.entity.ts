import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Habit } from "../../habit/entities/habit.entity";
import { HabitScheduleType } from "../../habit/utils/habit_enums";

@Entity()
export class HabitSchedule {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Habit, (habit) => habit.habitSchedule, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'habitId' })
    habit: Habit;

    @Column({ type: 'enum', enum: HabitScheduleType })
    type: HabitScheduleType;

    @Column("int", { array: true, nullable: true })
    daysOfWeek: number[];

    @Column("int", { array: true, nullable: true })
    daysOfMonth: number[];
}
