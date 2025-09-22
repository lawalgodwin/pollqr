import { AbstractEntity } from 'src/database/abstract.entity';
import { Poll } from './poll.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PollOption extends AbstractEntity<PollOption> {
  @PrimaryGeneratedColumn('uuid')
  optionId: string;

  @Column()
  text: string;

  @Column({ default: 0 })
  count: number;

  @Column({ type: 'uuid' })
  pollId: string;
}
