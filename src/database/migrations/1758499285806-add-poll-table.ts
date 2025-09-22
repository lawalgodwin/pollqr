import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPollTable1758499285806 implements MigrationInterface {
  name = 'AddPollTable1758499285806';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "poll" (
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "pollId" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "question" character varying NOT NULL,
                "options" text NOT NULL,
                "startDate" TIMESTAMP NOT NULL,
                "endDate" TIMESTAMP NOT NULL,
                "visibility" character varying NOT NULL DEFAULT 'public',
                "ownerId" character varying NOT NULL,
                CONSTRAINT "PK_d9d59164fd7299b65ee497ccdfc" PRIMARY KEY ("pollId")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "poll"
        `);
  }
}
