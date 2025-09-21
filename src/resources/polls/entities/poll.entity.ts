import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import {z} from "zod"

@Entity()
export class Poll extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  question: string;

  @Column("simple-array")
  options: string[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
