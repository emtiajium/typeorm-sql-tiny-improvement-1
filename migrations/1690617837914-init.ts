import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1690617837914 implements MigrationInterface {
    name = 'Init1690617837914';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "User" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "version" integer NOT NULL DEFAULT '1',
                "email" character varying NOT NULL,
                "roleId" uuid NOT NULL,
                CONSTRAINT "UQ_User_email" UNIQUE ("email"),
                CONSTRAINT "PK_User_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "Role" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "version" integer NOT NULL DEFAULT '1',
                "type" character varying NOT NULL DEFAULT 'CUSTOMER',
                CONSTRAINT "PK_Role_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "User"
            ADD CONSTRAINT "FK_User_roleId_Role_id" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "User" DROP CONSTRAINT "FK_User_roleId_Role_id"
        `);
        await queryRunner.query(`
            DROP TABLE "Role"
        `);
        await queryRunner.query(`
            DROP TABLE "User"
        `);
    }
}
