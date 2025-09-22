import { AbstractEntity } from 'src/database/abstract.entity';
import { User } from 'src/resources/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Poll extends AbstractEntity<Poll> {
  @PrimaryGeneratedColumn('uuid')
  pollId: string;

  @Column()
  question: string;

  @Column('simple-array', { nullable: false })
  options: string[];

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ enum: ['public', 'private'], default: 'public' })
  visibility: 'public' | 'private';

  @ManyToOne(() => User, { nullable: false })
  owner: User;
}
