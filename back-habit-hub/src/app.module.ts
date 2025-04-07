import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/entities/users.entity'
import { EmailModule } from './email/email.module';
import { HabitModule } from './habit/habit.module';
import { Habit } from './habit/entities/habit.entity';
import { HabitProgress } from './habit/entities/habit_progress.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  
      envFilePath: '.env',  
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [User, Habit, HabitProgress],
      synchronize: true,
    }),
    UsersModule,
    EmailModule,
    HabitModule,
  ],
  controllers: [], 
  providers: [], 
})
export class AppModule {}
