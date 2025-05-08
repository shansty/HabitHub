import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
  } from 'typeorm';
import { User } from '../../user_module/users/entities/users.entity';
import { FriendshipStatus } from '../friendship_enum';
  
  @Entity()
  @Unique(['user1', 'user2'])
  export class Friendship {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, { eager: true })
    user1: User; 
  
    @ManyToOne(() => User, { eager: true })
    user2: User;

    @Column({type: 'enum', enum: FriendshipStatus })
    status: FriendshipStatus
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  