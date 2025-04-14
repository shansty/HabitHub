import { User } from "../../users/entities/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Habit } from "../../habit/entities/habit.entity";

@Entity()
export class HabitOccurrence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Habit, (habit) => habit.habitOccurence, {
    onDelete: 'CASCADE',
  })
  habit: Habit;

  @Column()
  habitId: number;

  @CreateDateColumn()
  createdAt: Date;
}
