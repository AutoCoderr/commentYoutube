import {migrate} from "./lib/Migration";
import express from 'express';
import cors from 'cors';
import SessionRouter from "./routes/SessionRouter";
import CommentRouter from "./routes/CommentRouter";
import VideoRouter from "./routes/VideoRouter";
import JWTMiddleWare from "./middlewares/JWTMiddleWare";

migrate().then(() => console.log("Migration effectuée!"));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use('/session', SessionRouter);
app.use(JWTMiddleWare);
app.use('/comment', CommentRouter);
app.use('/video', VideoRouter);

app.listen(81);
