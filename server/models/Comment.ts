import { Model, DataTypes } from "sequelize";
import { sequelize } from "../DB";
import User,{IUser} from "./User";

const {DB_PREFIX} = process.env;

export interface IComment {
    id?: number;
    ytvideo_id: string;
    content: string;
    User: IUser;
    created_at: Date;
    updated_at: Date;
}

export default class Comment extends Model {
    public id!: number;
    public ytvideo_id!: string;
    public content!: string;
    public User!: IUser;
    public created_at!: Date;
    public updated_at!: Date;
}

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        ytvideo_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: DB_PREFIX+"comment",
        sequelize, // passing the `sequelize` instance is required
    }
);

Comment.belongsTo(User);
User.hasMany(Comment);