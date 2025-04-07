import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, type: 'varchar' })
  profile_picture: string | null;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true, type: 'varchar' })
  verification_code: string | null;

  @Column({ type: 'timestamp', nullable: true })
  verification_expires_at: Date;

  @Column({ nullable: true, type: 'varchar' })
  reset_code?: string;

  @Column({ type: 'timestamp', nullable: true })
  reset_code_expires_at?: Date;

  @Column({ nullable: true, type: 'varchar' })
  temp_password?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
