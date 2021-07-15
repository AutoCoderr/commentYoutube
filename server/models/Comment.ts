import { Model, DataTypes } from "sequelize";
import { sequelize } from "../DB";
import User,{IUser} from "./User";

const {DB_PREFIX} = process.env;

export interface IComment {
    id?: number;
    ytvideo_id: string;
    content: string;
    User: IUser;
    UserId: number;
    createdAt: Date;
    updatedAt: Date;
}

export default class Comment extends Model {
    public id!: number;
    public ytvideo_id!: string;
    public content!: string;
    public User!: IUser;
    public UserId!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
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