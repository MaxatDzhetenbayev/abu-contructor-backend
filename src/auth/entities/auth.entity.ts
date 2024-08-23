import { Table, Model, Column } from "sequelize-typescript";

@Table({
    tableName: 'auth',
})
export class Auth extends Model<Auth> {
    @Column
    login: string;

    @Column
    password: string;

    @Column
    role: string;

    @Column
    token: string | null;
}
