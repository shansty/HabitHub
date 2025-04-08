import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Habit } from './habit.entity';

@Entity()
export class HabitEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Habit, { onDelete: 'CASCADE' })
  habit: Habit;

  @Column()
  habitId: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'int' }) 
  value: number;

  @Column({ default: false })
  isGoalCompleted: boolean;

}
