import { Model, DataTypes } from "sequelize";
import { sequelize } from "../DB";
import {IComment} from "./Comment";
import {IReaction} from "./Reaction";

const {DB_PREFIX} = process.env;

export interface IUser {
    id?: string;
    email?: string;
    type: 'anon'|'google';
    firstname: string;
    lastname: string;
    Comments?: Array<IComment>;
    Reactions?: Array<IReaction>;
    profile_pic_uri?: string;
}

export default class User extends Model {
    public id!: string;
    public email?: string;
    public type!: 'anon'|'google';
    public firstname!: string;
    public lastname!: string;
    public Comments?: Array<IComment>;
    public Reactions?: Array<IReaction>;
    public profile_pic_uri?: string;
}

User.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        profile_pic_uri: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        timestamps: false,
        tableName: DB_PREFIX+"user",
        sequelize, // passing the `sequelize` instance is required
    }
);
