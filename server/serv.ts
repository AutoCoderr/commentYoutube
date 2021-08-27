import {migrate} from "./lib/Migration";
import express from 'express';
import cors from 'cors';
import SessionRouter from "./routes/SessionRouter";
import CommentRouter from "./routes/CommentRouter";
import getYTVideo from "./lib/getYTVideo";
import JWTMiddleWare from "./middlewares/JWTMiddleWare";

migrate().then(() => console.log("Migration effectuée!"));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use('/session', SessionRouter);
app.use(JWTMiddleWare);
app.use('/comment', CommentRouter);

app.get('/get_yt_video/:ytvideo_id', async (req, res) => {
    const video = await getYTVideo(req.params.ytvideo_id);
    if (video)
        res.json({
            ...video,
            likes: video.reactions.filter(reaction => reaction.type == "like").length,
            liked: video.reactions.some(reaction => reaction.type == "like" && reaction.UserId == req.user.id),
            dislikes: video.reactions.filter(reaction => reaction.type == "dislike").length,
            disliked: video.reactions.some(reaction => reaction.type == "dislike" && reaction.UserId == req.user.id),
            reactions: undefined
        });
    else
        res.sendStatus(404);
});

app.listen(81);
