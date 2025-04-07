import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, } from 'typeorm';
import { HabitCategory } from '../utils/habit-category-icons';
import { HabitProgress } from './habit_progress.entity';
import { User } from '../../users/entities/users.entity';


@Entity()
export class Habit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: HabitCategory })
    category: HabitCategory;

    @Column({ type: 'date' })
    startDate: Date;

    @Column({ type: 'date', nullable: true })
    endDate: Date | null;

    @OneToMany(() => HabitProgress, (progress) => progress.habit)
    progressRecords: HabitProgress[];

    @ManyToOne(() => User, (user) => user.habits, { onDelete: 'CASCADE' })
    user: User;

    @Column()
    userId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
