import { Sequelize } from "sequelize";
const {DB_NAME, DB_USER, DB_PASSWORD, DB_DRIVER, DB_HOST, DB_PORT} = process.env;

export const sequelize = new Sequelize(DB_DRIVER+"://"+DB_USER+":"+DB_PASSWORD+"@"+DB_HOST+":"+DB_PORT+"/"+DB_NAME, {
    logging: false
});