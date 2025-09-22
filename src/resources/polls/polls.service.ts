import { Injectable } from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PollRepository } from './repositories/poll.repository';
import { Poll } from './entities/poll.entity';

@Injectable()
export class PollsService {
  constructor(private readonly pollRepository: PollRepository) {}
  create(createPollDto: CreatePollDto) {
    const newPoll = new Poll(createPollDto);
    return this.pollRepository.create(newPoll);
  }

  findAll() {
    return this.pollRepository.findAll();
  }

  findOne(pollId: string) {
    return this.pollRepository.findOneBy({ pollId });
  }

  update(pollId: string, updatePollDto: UpdatePollDto) {
    return this.pollRepository.update({ pollId }, updatePollDto);
  }

  remove(pollId: string) {
    return this.pollRepository.delete(pollId);
  }
}
