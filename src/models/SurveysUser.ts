import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Survey } from "./Survey";
import { User } from "./User";

@Entity("surveys_users")
class SurveysUser {
    @PrimaryColumn()
    readonly id: string;

    @Column()
    user_id: string;

    // Linka o objeto entre as duas tabelas pela coluna referenciada neste caso em especifico de id
    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User

    @Column()
    survey_id: string;

    // Linka o objeto entre as duas tabelas pela coluna referenciada neste caso em especifico de id
    @ManyToOne(() => Survey)
    @JoinColumn({ name: "survey_id" })
    survey: User

    @Column()
    value: number;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }

}

export { SurveysUser };
