import {migrate} from "./lib/Migration";
import express from 'express';
import cors from 'cors';
import SessionRouter from "./routes/SessionRouter";
import CommentRouter from "./routes/CommentRouter";
import getYTVideo from "./lib/getYTVideo";

migrate().then(() => console.log("Migration effectuée!"));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use('/session', SessionRouter);
app.use('/comment', CommentRouter);

app.get('/get_yt_video/:ytvideo_id', async (req, res) => {
    const video = await getYTVideo(req.params.ytvideo_id);
    if (video)
        res.json(video);
    else
        res.sendStatus(404);
});

app.listen(81);
