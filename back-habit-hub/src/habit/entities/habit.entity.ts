import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, OneToMany, } from 'typeorm';
import { GoalPeriodicityType, HabitDomain, HabitStatus, HabitType, UnitOfMeasurementType } from '../utils/habit_enums';
import { User } from '../../users/entities/users.entity';
import { HabitSchedule } from './habit_repeat.entity';
import { HabitEvent } from './habit_event.entity';
import { HabitDay } from './habit_day.entity';


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

    @OneToOne(() => HabitSchedule, (repeat) => repeat.habit, { cascade: true })
    habitSchedule: HabitSchedule;

    @OneToMany(() => HabitDay, (habitDay) => habitDay.habit)
    habitDays: HabitDay[];

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

    @ManyToOne(() => User, (user) => user.habits, { onDelete: 'CASCADE' })
    user: User;

    @Column()
    userId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
