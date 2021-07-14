import { Model, DataTypes } from "sequelize";
import { sequelize } from "../DB";
import User from "./User";

const {DB_PREFIX} = process.env;

export default class Comment extends Model {
    public id!: number;
    public content!: string;
    public User!: User;
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