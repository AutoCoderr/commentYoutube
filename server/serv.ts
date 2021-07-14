import {migrate} from "./lib/Migration";

migrate().then(() => console.log("Migration effectuée!"));

console.log(process.env.GOOGLE_CLIENT_ID);

setTimeout(() => {
    process.exit();
}, 1000*60*5);