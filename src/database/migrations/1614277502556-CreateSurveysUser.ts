import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSurveysUser1614277502556 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(

            new Table({
                name: "surveys_users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "user_id",
                        type: "uuid"
                    },
                    {
                        name: "survey_id",
                        type: "uuid",
                    },
                    {
                        name: "value",
                        type: "number",
                        isNullable: true
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()"
                    }

                ], foreignKeys: [
                    {
                        name: "FK_user",
                        referencedTableName: "users",
                        referencedColumnNames: ["id"],
                        columnNames: ["user_id"],
                        onDelete: "cascade",
                        onUpdate: "cascade"
                    },
                    {
                        name: "FK_surveys",
                        referencedTableName: "surveys",
                        referencedColumnNames: ["id"],
                        columnNames: ["survey_id"],
                        onDelete: "cascade",
                        onUpdate: "cascade"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("surveys_users")
    }

}
