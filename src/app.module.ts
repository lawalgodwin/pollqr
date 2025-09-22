import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PollsModule } from './resources/polls/polls.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './resources/users/users.module';

@Module({
  imports: [PollsModule, DatabaseModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
