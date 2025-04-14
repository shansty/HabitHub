import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, OneToMany, JoinColumn, } from 'typeorm';
import { GoalPeriodicityType, HabitDomain, HabitStatus, HabitType, UnitOfMeasurementType } from '../utils/habit_enums';
import { User } from '../../users/entities/users.entity';
import { HabitSchedule } from '../../habit_schedule/entities/habit_schedule.entity';
import { HabitEvent } from '../../habit_event/entities/habit_event.entity';
import { HabitOccurrence } from '../../habit_occurrence/entities/habit_occurrence.entity';


@Entity()
export class Habit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    goal: number;

    @Column({ type: 'enum', enum: UnitOfMeasurementType })
    unit: UnitOfMeasurementType

    @Column({ type: 'enum', enum: GoalPeriodicityType })
    goalPeriodicity: GoalPeriodicityType

    @Column()
    goalDuration: Number;

    @OneToOne(() => HabitSchedule, (schedule) => schedule.habit, {
        cascade: true,
        onDelete: 'CASCADE',
        eager: true,
    })
    habitSchedule: HabitSchedule;

    @OneToMany(() => HabitOccurrence, (habitOccurence) => habitOccurence.habit)
    habitOccurence: HabitOccurrence[];

    @Column({ type: 'enum', enum: HabitType, default: HabitType.GOOD })
    type: HabitType;

    @Column({ type: 'enum', enum: HabitDomain })
    category: HabitDomain;

    @Column()
    icon: string;

    @Column({ type: 'date' })
    startDate: Date;

    @OneToMany(() => HabitEvent, (event) => event.habit)
    events: HabitEvent[];

    @Column({ type: 'enum', enum: HabitStatus, default: 'IN_PROGRESS' })
    status: HabitStatus

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
