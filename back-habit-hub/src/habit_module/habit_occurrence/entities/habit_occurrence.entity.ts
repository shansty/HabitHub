import { User } from "../../../user_module/users/entities/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Habit } from "../../habit/entities/habit.entity";

@Entity()
export class HabitOccurrence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Habit, (habit) => habit.habitOccurrence, {
    onDelete: 'CASCADE',
  })
  habit: Habit;

  @Column()
  habitId: number;

  @CreateDateColumn()
  createdAt: Date;
}
