import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate,
    AfterLoad,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Picture {
    @PrimaryGeneratedColumn("uuid")
    picture_id: string;

    @Column({ length: 40 })
    name: string;

    @Column("text")
    picture_data: string;

    @ManyToOne(() => User, (user) => user.id, { eager: true, nullable: false })
    author: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    private _picture_data_matrix: string[][];

    @AfterLoad()
    loadPictureData() {
        this._picture_data_matrix = JSON.parse(this.picture_data);
    }

    @BeforeInsert()
    @BeforeUpdate()
    serializePictureData() {
        this.picture_data = JSON.stringify(this._picture_data_matrix);
    }

    get matrix(): string[][] {
        return this._picture_data_matrix;
    }

    set matrix(value: string[][]) {
        this._picture_data_matrix = value;
        this.picture_data = JSON.stringify(this._picture_data_matrix);
    }

}
