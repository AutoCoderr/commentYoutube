import { Model, DataTypes } from "sequelize";
import { sequelize } from "../DB";
import User,{IUser} from "./User";

const {DB_PREFIX} = process.env;

export interface IComment {
    id?: number;
    ytvideo_id: string;
    content: string;
    likes: number;
    dislikes: number;
    User: IUser;
    UserId: number;
    ParentId: number;
    parent: IComment;
    children: Array<IComment>;
    createdAt: Date;
    updatedAt: Date;
}

export default class Comment extends Model {
    public id!: number;
    public ytvideo_id!: string;
    public content!: string;
    public likes!: number;
    public dislikes!: number;
    public User!: IUser;
    public UserId!: number;
    public ParentId!: number;
    public parent!: IComment;
    public children!: Array<IComment>;
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
        likes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        dislikes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
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

Comment.belongsTo(Comment, {as: 'parent', foreignKey: 'ParentId', onDelete: 'CASCADE'});
Comment.hasMany(Comment, {as: 'children', foreignKey: 'ParentId', onDelete: 'CASCADE'});
