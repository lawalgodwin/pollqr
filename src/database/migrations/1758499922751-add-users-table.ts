import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsersTable1758499922751 implements MigrationInterface {
  name = 'AddUsersTable1758499922751';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "poll"
                RENAME COLUMN "ownerId" TO "ownerUserId"
        `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "poll" DROP COLUMN "ownerUserId"
        `);
    await queryRunner.query(`
            ALTER TABLE "poll"
            ADD "ownerUserId" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "poll"
            ADD CONSTRAINT "FK_210d52a104bda1af9cb2ea8a147" FOREIGN KEY ("ownerUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "poll" DROP CONSTRAINT "FK_210d52a104bda1af9cb2ea8a147"
        `);
    await queryRunner.query(`
            ALTER TABLE "poll" DROP COLUMN "ownerUserId"
        `);
    await queryRunner.query(`
            ALTER TABLE "poll"
            ADD "ownerUserId" character varying NOT NULL
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            ALTER TABLE "poll"
                RENAME COLUMN "ownerUserId" TO "ownerId"
        `);
  }
}
