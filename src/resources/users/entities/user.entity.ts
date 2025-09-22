import { AbstractEntity } from 'src/database/abstract.entity';
import { Poll } from 'src/resources/polls/entities/poll.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends AbstractEntity<User> {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @OneToMany(() => Poll, (poll) => poll.owner)
  polls: Poll[];
}
