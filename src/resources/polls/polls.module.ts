import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { DatabaseModule } from 'src/database/database.module';
import { Poll } from './entities/poll.entity';
import { PollRepository } from './repositories/poll.repository';

@Module({
  imports: [DatabaseModule.forFeature([Poll])],
  controllers: [PollsController],
  providers: [PollsService, PollRepository],
})
export class PollsModule {}
