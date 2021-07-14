const fs = require("fs/promises");
import {sequelize} from "../DB";

export async function migrate() {
    const modelDir = __dirname+"/../models/";
    await fs.readdir(modelDir)
        .then(files => files.filter(file => file.endsWith('.js')))
        .then(files => files.map(file => require(modelDir+file)));

    await sequelize.sync({alter: true});
}