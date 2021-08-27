import {Router} from "express";
import getYTVideo from "../lib/getYTVideo";
import Reaction from "../models/Reaction";
import getOrCreateUser from "../lib/getOrCreateUser";

const VideoRouter = Router();

VideoRouter.get('/:ytvideo_id', async (req, res) => {
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

const reactOnVideo = async (req,res,type: 'like'|'dislike') => {
    const user = await getOrCreateUser(req.user);
    const video = await getYTVideo(req.params.ytvideo_id);
    if (video) {
        let foundReaction: undefined|Reaction;
        const {reactions} = video;
        if ((foundReaction = reactions.find(reaction => reaction.type == type && reaction.UserId == user.id))) {
            await foundReaction.destroy();
            res.sendStatus(204);
        } else {
            await new Reaction({
                UserId: user.id,
                YTVideo: req.params.ytvideo_id,
                type
            }).save();
            if ((foundReaction = reactions.find(reaction =>
                ((type == 'like' && reaction.type == 'dislike') || (type == 'dislike' && reaction.type == 'like')) && reaction.UserId == user.id
            ))) {
                await foundReaction.destroy();
            }
            res.sendStatus(204)
        }
    } else
        res.sendStatus(404);
}

VideoRouter.put('/like/:ytvideo_id', (req, res) => reactOnVideo(req,res,'like'));
VideoRouter.put('/dislike/:ytvideo_id', (req, res) => reactOnVideo(req,res,'dislike'));

export default VideoRouter;
