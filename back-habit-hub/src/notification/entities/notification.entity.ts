import { User } from "../../user_module/users/entities/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NotificationType } from "../notification_enums";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notificationsSent, { eager: true })
  sender: User;

  @ManyToOne(() => User, (user) => user.notificationsReceived, { eager: true })
  recipient: User;

  @Column({ type: 'enum', enum: NotificationType})
  type: NotificationType;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
