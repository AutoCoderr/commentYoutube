import {migrate} from "./lib/Migration";
import express from 'express';
import SessionRouter from "./routes/SessionRoute";
import CommentRouter from "./routes/CommentRouter";
import checkVideoExist from "./lib/checkVideoExist";

migrate().then(() => console.log("Migration effectuée!"));

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use('/session', SessionRouter);
app.use('/comment', CommentRouter);

app.get('/check_yt_video/:ytvideo_id', async (req, res) => {
    res.sendStatus(await checkVideoExist(req.params.ytvideo_id) ? 200 : 404);
});

app.listen(81);