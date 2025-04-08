import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, OneToMany, } from 'typeorm';
import { HabitStatus } from '../utils/habit_enums';
import { User } from '../../users/entities/users.entity';
import { HabitRepeat } from './habit_repeat.entity';
import { HabitEvent } from './habit_event.entity';


enum GoalPeriodicityType {
    PER_DAY = 'PER DAY',
    PER_WEEK = 'PER WEEK',
    PER_MONTH = 'PER MONTH',
}

enum UnitOfMeasurementType {
    TIMES = 'TIMES',
    MINS = 'MINS',
    HOURS = 'HOURS',
    KM = 'KM',
    M = 'M',
    KG = 'KG',
    G = 'G',
    MG = 'MG',
    L = 'L',
    ML = 'ML',
}


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

    @OneToOne(() => HabitRepeat, (repeat) => repeat.habit, { cascade: true })
    habitRepeat: HabitRepeat;

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
