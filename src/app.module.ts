import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PollsModule } from './resources/polls/polls.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [PollsModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
