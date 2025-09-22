import { AbstractRepository } from 'src/database/abstract.repository';
import { Poll } from '../entities/poll.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class PollRepository extends AbstractRepository<Poll> {
  constructor(@InjectRepository(Poll) pollRepository: Repository<Poll>) {
    super(pollRepository);
  }
}
