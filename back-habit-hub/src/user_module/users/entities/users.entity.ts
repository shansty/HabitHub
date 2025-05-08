import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm'
import { Habit } from '../../../habit_module/habit/entities/habit.entity'
import { HabitOccurrence } from '../../../habit_module/habit_occurrence/entities/habit_occurrence.entity'
import { Friendship } from '../../../friendship/entities/friendship.entity'
import { Notification } from '../../../notification/entities/notification.entity'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true, nullable: false })
    username: string

    @Column({ unique: true, nullable: false })
    email: string

    @Column()
    password: string

    @Column({ nullable: true, type: 'varchar' })
    profile_picture: string | null

    @Column({ default: false })
    isVerified: boolean

    @Column({ nullable: true, type: 'varchar' })
    verification_code: string | null

    @Column({ type: 'timestamp', nullable: true })
    verification_expires_at: Date

    @Column({ nullable: true, type: 'varchar' })
    reset_code?: string

    @Column({ type: 'timestamp', nullable: true })
    reset_code_expires_at?: Date

    @Column({ nullable: true, type: 'varchar' })
    temp_password?: string

    @OneToMany(() => Habit, (habit) => habit.user, { cascade: true })
    habits: Habit[]

    @OneToMany(
        () => HabitOccurrence,
        (habitOcccurrence) => habitOcccurrence.user
    )
    habitOcccurrences: HabitOccurrence[]

    @OneToMany(() => Friendship, (friendship) => friendship.user1)
    friendshipsInitiated: Friendship[];

    @OneToMany(() => Friendship, (friendship) => friendship.user2)
    friendshipsReceived: Friendship[];

    @OneToMany(() => Notification, (notification) => notification.sender)
    notificationsSent: Notification[];

    @OneToMany(() => Notification, (notification) => notification.recipient)
    notificationsReceived: Notification[];

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}
