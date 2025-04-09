import { User } from "../../users/entities/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Habit } from "./habit.entity";

@Entity()
export class HabitDay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Habit, { onDelete: 'CASCADE' })
  habit: Habit;

  @Column()
  habitId: number;

  @CreateDateColumn()
  createdAt: Date;
}
