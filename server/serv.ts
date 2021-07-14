import {migrate} from "./lib/Migration";
import express from 'express';
import SessionRouter from "./routes/SessionRoute";
import CommentRouter from "./routes/CommentRouter";

migrate().then(() => console.log("Migration effectuée!"));

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use('/session', SessionRouter);
app.use('/comment', CommentRouter);

app.listen(81);