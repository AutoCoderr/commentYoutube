import { Model, DataTypes } from "sequelize";
import { sequelize } from "../DB";

const {DB_PREFIX} = process.env;

export default class User extends Model {
    public id!: number;
    public email?: string;
    public type!: 'anon'|'google';
    public firstname!: string;
    public lastname!: string;
    public profile_pic_uri!: string;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
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
            allowNull: false
        }
    },
    {
        timestamps: false,
        tableName: DB_PREFIX+"user",
        sequelize, // passing the `sequelize` instance is required
    }
);