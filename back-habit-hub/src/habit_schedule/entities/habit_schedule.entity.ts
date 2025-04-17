import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Habit } from "../../habit/entities/habit.entity";
import { HabitDomain, Schedule  } from "../../habit/utils/habit_enums";

@Entity()
export class HabitSchedule {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Habit, (habit) => habit.habitSchedule, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'habitId' })
    habit: Habit;

    @Column({ type: 'enum', enum: Schedule})
    type: Schedule;

    @Column("int", { array: true, nullable: true })
    daysOfWeek: number[];

    @Column("int", { array: true, nullable: true })
    daysOfMonth: number[];
}
