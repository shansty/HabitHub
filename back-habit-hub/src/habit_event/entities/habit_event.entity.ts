import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Habit } from '../../habit/entities/habit.entity';

@Entity()
export class HabitEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Habit, (habit) => habit.events, {
    onDelete: 'CASCADE',
  })
  habit: Habit;


  @Column()
  habitId: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'int' }) 
  value: number;

  @Column({ default: false })
  isGoalCompleted: boolean;

  @Column({ default: false })
  isFailure: boolean;

  @CreateDateColumn()
  createdAt: Date;

}
