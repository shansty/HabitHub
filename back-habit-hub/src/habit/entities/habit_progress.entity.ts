import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, CreateDateColumn} from 'typeorm';
  import { Habit } from './habit.entity';
  
  @Entity()
  @Unique(['habit', 'date']) 
  export class HabitProgress {

    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Habit, { onDelete: 'CASCADE' })
    habit: Habit;
  
    @Column()
    habitId: number;
  
    @Column({ type: 'date' })
    date: Date;
  
    @Column({ default: false }) 
    completed: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  }
  