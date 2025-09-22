import { AbstractEntity } from 'src/database/abstract.entity';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vote extends AbstractEntity<Vote> {
  @PrimaryGeneratedColumn('uuid')
  voteId: string;
}
