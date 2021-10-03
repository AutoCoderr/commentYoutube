import { Model, DataTypes } from "sequelize";
import { sequelize } from "../DB";
import Comment,{IComment} from "./Comment";
import User,{IUser} from "./User";

const {DB_PREFIX} = process.env;

export interface IReaction {
    id?: number;
    Comment?: IComment;
    CommentId: null|number
    YTVideo?: string;
    User: IUser;
    UserId: null|string
    type: 'like'|'dislike'
}

export default class Reaction extends Model {
    public id!: number;
    public Comment?: IComment;
    public CommentId!: null|number
    public YTVideo?: string;
    public User!: IUser;
    public UserId!: null|string
    public type!: 'like'|'dislike'
}

Reaction.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        YTVideo: {
            type: DataTypes.STRING
        }
    },
    {
        tableName: DB_PREFIX+"reaction",
        sequelize, // passing the `sequelize` instance is required
    }
);

Reaction.belongsTo(User);
User.hasMany(Reaction);

Reaction.belongsTo(Comment);
Comment.hasMany(Reaction);
